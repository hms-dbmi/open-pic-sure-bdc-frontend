define(["jquery", "backbone", "handlebars", "text!landing/landing.hbs", "picSure/search", "picSure/settings",
        "picSure/queryBuilder", "common/spinner", "common/transportErrors", "studyAccess/study-utility"],
    function ($, BB, HBS, landingTemplate, search, settings, queryBuilder, spinner,
              transportErrors, studyUtility) {
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
                "keypress #landingSearchInput": "handleLandingSearchKeypress",
            },
            handleLandingSearchKeypress: function (event) {
                if (event.keyCode === 13) {
                    this.handleLandingSearch(event);
                }
            },
            handleLandingSearch: function (event) {
                // Log the search event
                let searchQuery = $("#landingSearchInput").val();

                // encode the search query
                searchQuery = encodeURIComponent(searchQuery);

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
                let parsedCountString;
                let variables;
                let query = queryBuilder.generateQueryNew({}, {}, null, landing.resources.open);
                query.query.expectedResultType = "CROSS_COUNT";
                query.query.crossCountFields = [STUDY_CONSENTS];

                let deferredParticipants = $.Deferred();
                let deferredVariables = $.Deferred();

                spinner.medium(deferredVariables, "#open-variables-spinner", "spinner2");
                spinner.medium(deferredParticipants, "#open-participants-spinner", "spinner2");
                spinner.medium(deferredParticipants, "#available-studies-spinner", "spinner2");

                $.ajax({
                    url: window.location.origin + "/picsure/query/sync",
                    type: 'POST',
                    headers: {"Authorization": "Bearer " + JSON.parse(sessionStorage.getItem("session"))?.token},
                    contentType: 'application/json',
                    data: JSON.stringify(query)
                }).then((response) => {
                    parsedCountString = response[STUDY_CONSENTS] ? parseInt(response[STUDY_CONSENTS]).toLocaleString() : 0;
                    deferredParticipants.resolve();
                    $("#open-participants").html(parsedCountString);
                    $('#available-studies').html(studyUtility.getAvailableStudiesCount());
                }).fail(transportErrors.handleAll);

                $.ajax({
                    url: window.location.origin + "/picsure/search/" + settings.dictionaryResourceId,
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
                    })
                }).then((response) => {
                    variables = parseInt(response.results.numResults).toLocaleString();
                    deferredVariables.resolve();
                    $("#open-variables").html(variables ?? 0);
                }).fail((response) => {
                    console.log(response);
                });

                this.$el.html(this.template());
                return this;
            }
        });
    }
);
