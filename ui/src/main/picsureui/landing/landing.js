define(["jquery", "backbone", "handlebars", "text!landing/landing.hbs", "picSure/search", "picSure/settings",
        "picSure/queryBuilder", "common/spinner", "common/transportErrors", "text!studyAccess/studies-data.json",
        "search-interface/filter-model"],
    function ($, BB, HBS, landingTemplate, search, settings, queryBuilder, spinner,
              transportErrors) {
        const STUDY_CONSENTS = "\\_studies_consents\\";
        const landing = {
            resources: {
                open: settings.openAccessResourceId,
            }
        };

        return BB.View.extend({
            initialize: function () {
                this.template = HBS.compile(landingTemplate);
            },
            events: {
                "click #landingSearchButton": "handleLandingSearch",
            },
            handleLandingSearch: function (event) {
                // Log the search event
                let searchQuery = $("#landingSearchInput").val();
                /*
                    When the user clicks the search button, we want to capture the search query.
                    Put the search query into the session storage so that it can be used by the
                    explorer page.
                 */
                sessionStorage.setItem("landingSearchQuery", searchQuery);
                // Navigate to the explorer page
                window.location.href = "/picsureui/openAccess";
            },
            render: function () {
                search.execute("\\_studies\\", function (response) {
                        let openStudies = response.suggestions.length;

                        let query = queryBuilder.generateQueryNew({}, {}, null, landing.resources.open);
                        query.query.expectedResultType = "CROSS_COUNT";
                        query.query.crossCountFields = [STUDY_CONSENTS];
                        let deferredParticipants = $.ajax({
                            url: window.location.origin + "/picsure/query/sync",
                            type: 'POST',
                            headers: {"Authorization": "Bearer " + JSON.parse(sessionStorage.getItem("session")).token},
                            contentType: 'application/json',
                            data: JSON.stringify(query),
                            success: (function (response) {
                                const parsedCountString = response[STUDY_CONSENTS] ? parseInt(response[STUDY_CONSENTS]).toLocaleString() : 0;
                                $("#open-participants").html(parsedCountString);
                                $('#available-studies').html(openStudies);
                            }).bind(this),

                            statusCode: {
                                401: function () {
                                }
                            },
                            error: transportErrors.handleAll
                        });

                        let deferredVariables = $.ajax({
                            url: window.location.origin + "/picsure/search/36363664-6231-6134-2D38-6538652D3131",
                            type: 'POST',
                            contentType: 'application/json',
                            data: JSON.stringify({
                                "query": {
                                    "searchTerm": "",
                                    "includedTags": [],
                                    "excludedTags": [],
                                    "returnTags": false,
                                    "limit": 1
                                }
                            }),
                            success: function (response) {
                                console.log(response);
                                $("#open-variables").html(parseInt(response.results.numResults).toLocaleString());
                            },
                            error: function (response) {
                                console.log(response);
                            }
                        });

                        spinner.medium(deferredVariables, "#open-variables-spinner", "spinner2");
                        spinner.medium(deferredParticipants, "#open-participants-spinner", "spinner2");
                        spinner.medium(deferredParticipants, "#available-studies-spinner", "spinner2");
                    },
                    landing.resources.open);

                this.$el.html(this.template());
                return this;
            }
        });
    })
;

