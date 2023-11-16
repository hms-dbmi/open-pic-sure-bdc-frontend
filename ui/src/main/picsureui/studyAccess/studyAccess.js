define(["jquery", "backbone", "handlebars", "text!studyAccess/studyAccess.hbs", "text!studyAccess/studies-data.json",
        "common/transportErrors", "picSure/queryBuilder", "picSure/settings", "common/spinner"],
    function ($, BB, HBS, studyAccessTemplate, studyAccessConfiguration,
              transportErrors, queryBuilder, settings, spinner) {
        let studyAccess = {};

        // build view
        studyAccess.View = BB.View.extend({
            tagName: "div",
            template: studyAccess.studyAccessTemplate,
            initialize: function () {
                HBS.registerHelper('valueOrNA', function (value) {
                    return value == -1 ? "n/a" : value;
                });

                // setup the output template
                this.template = HBS.compile(studyAccessTemplate);

                // process the study data into permission granted or not groups
                this.records = {
                    permitted: [],
                    na: []
                };

                let configurationData = JSON.parse(studyAccessConfiguration);
                for (let groupId in configurationData) {
                    for (let idx = 0; idx < configurationData[groupId].length; idx++) {
                        // determine if logged in user is permmited access
                        let tmpStudy = configurationData[groupId][idx];
                        const cvc = parseInt(tmpStudy["clinical_variable_count"]).toLocaleString();
                        tmpStudy["clinical_variable_count"] = cvc == '-1' || cvc == 'NaN' ? 'N/A' : cvc;
                        const css = parseInt(tmpStudy["clinical_sample_size"]).toLocaleString();
                        tmpStudy["clinical_sample_size"] = css == '-1' || cvc == 'NaN' ? 'N/A' : css;
                        const gsc = parseInt(tmpStudy["genetic_sample_size"]).toLocaleString();
                        tmpStudy["genetic_sample_size"] = gsc == '-1' || gsc == 'NaN' ? 'N/A' : gsc;


                        tmpStudy['accession'] = tmpStudy["study_identifier"] + "." + tmpStudy["study_version"] + "." + tmpStudy["study_phase"] + "." + tmpStudy["consent_group_code"];

                        if (tmpStudy["consent_group_code"] === "c0") {
                            tmpStudy['isGranted'] = false;
                            this.records.na.push(tmpStudy);
                        } else {
                            this.records.permitted.push(tmpStudy);
                        }

                    }
                }

                // sort by "consent group" then "abbreviated name"
                const funcSort = function (a, b) {
                    if (a["abbreviated_name"] === b["abbreviated_name"]) {
                        return (a["study_identifier"].localeCompare(b["study_identifier"]));
                    } else {
                        return (a["abbreviated_name"].localeCompare(b["abbreviated_name"]));
                    }
                };
                this.records.permitted.sort(funcSort);
                this.records.na.sort(funcSort);
            },
            events: {
                "click .study-lst-btn1": "toggleConsent",
                "click .study-lst-btn2": "toggleConsent",
                "click .clickable-button": "buttonClickHandler"
            },
            toggleConsent: function () {
                if ($("#no-consent-toggle").hasClass("glyphicon-chevron-down")) {
                    $("#data-access-table-na_wrapper").show();
                    $("#no-consent-toggle").removeClass("glyphicon-chevron-down");
                    $("#no-consent-toggle").addClass("glyphicon-chevron-up");
                } else {
                    $("#data-access-table-na_wrapper").hide();
                    $("#no-consent-toggle").removeClass("glyphicon-chevron-up");
                    $("#no-consent-toggle").addClass("glyphicon-chevron-down");
                }
            },
            buttonClickHandler: function (event) {
                if ($(event.target).data("href")) {
                    window.history.pushState({}, "", $(event.target).data("href"));
                }
            },
            render: function () {
                this.$el.html(this.template(this.records));

                $('#data-access-table').DataTable({
                    data: this.records.permitted,
                    searching: true,
                    paging: false,
                    ordering: true,
                    fixedColumns: false,
                    responsive: true,
                    tabIndex: -1,
                    order: [[0, 'asc']],
                    columns: [
                        {title: 'Abbreviation', data: 'abbreviated_name'},
                        {title: 'Name', data: 'full_study_name'},
                        {title: 'Study Focus', data: 'study_focus'},
                        {title: 'Study Design', data: 'study_design'},
                        {title: 'Clinical Variables', data: 'clinical_variable_count'},
                        {title: 'Participants with Phenotypes', data: 'clinical_sample_size'},
                        {title: 'Samples Sequenced', data: 'genetic_sample_size'},
                        {title: 'Additional Information', data: 'additional_information'},
                        {title: 'Consents', data: 'consent_group_name'},
                        {title: 'dbGaP Accession', data: 'accession'},
                        {title: 'Link to dbGaP Study Page', data: null},
                    ],
                    columnDefs: [
                        {
                            targets: 10,
                            className: 'dt-center',
                            type: 'string'
                        },
                        {
                            targets: [0, 2, 3, 4, 5, 6, 9],
                            className: 'dt-center',
                            type: 'string'
                        },
                        {
                            targets: [1, 7, 8],
                            className: 'dt-left',
                            type: 'string'
                        },
                        {
                            render: function (data, type, row, meta) {
                                return '<a href="' + data.request_access + '" target="_blank" aria-label="Clicking here will take you to the given link in another tab." ' +
                                    'title="Clicking here will take you to the given link in another tab">' +
                                    '<span class="btn btn-primary btn-blue" style="text-wrap: normal" aria-label="Request access to ' + data.full_study_name + '. This link will open in a new browser tab.">' +
                                    'Go To dbGaP Study Page</span>' +
                                    '</a>';
                            },
                            type: 'string',
                            targets: 10
                        }
                    ]
                });

                $('#data-access-table-na').DataTable({
                    data: this.records.na,
                    "searching": true,
                    "paging": false,
                    "ordering": true,
                    "fixedColumns": false,
                    "responsive": true,
                    "tabIndex": -1,
                    order: [[0, 'asc']],
                    columns: [
                        {title: 'Abbreviation', data: 'abbreviated_name'},
                        {title: 'Name', data: 'full_study_name'},
                        {title: 'Study Focus', data: 'study_focus'},
                        {title: 'Study Design', data: 'study_design'},
                        {title: 'Clinical Variables', data: 'clinical_variable_count'},
                        {title: 'Participants with Phenotypes', data: 'clinical_sample_size'},
                        {title: 'Samples Sequenced', data: 'genetic_sample_size'},
                        {title: 'Additional Infomation', data: 'additional_information'},
                        {title: 'Consents', data: 'consent_group_name'},
                        {title: 'dbGaP Accession', data: 'accession'},
                        {title: 'Link to dbGaP Study Page', data: null},
                    ],
                    columnDefs: [
                        {
                            targets: 10,
                            className: 'dt-center',
                            type: 'string'
                        },
                        {
                            targets: [0, 2, 3, 4, 5, 6, 9],
                            className: 'dt-center',
                            type: 'string'
                        },
                        {
                            targets: [1, 7, 8],
                            className: 'dt-left',
                            type: 'string'
                        },
                        {
                            render: function (data, type, row, meta) {
                                return '<span class="btn btn-default disabled">N/A</span>';
                            },
                            type: 'string',
                            targets: 10
                        }
                    ]
                });

                $("#data-access-table-na_wrapper").hide();
            }
        });

        return studyAccess;
    });
