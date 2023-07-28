define(["backbone", "handlebars", "studyAccess/studyAccess", "picSure/settings", "filter/filterList",
        "openPicsure/outputPanel", "picSure/queryBuilder", "text!openPicsure/searchHelpTooltipOpen.hbs", "overrides/outputPanel",
        "search-interface/filter-list-view", "search-interface/search-view", "search-interface/tool-suite-view",
        "search-interface/query-results-view", "api-interface/apiPanelView", "search-interface/filter-model",
        "search-interface/tag-filter-model", "openPicsure/tool-suite-view", "landing/landing"],
    function(BB, HBS, studyAccess, settings, filterList,
             outputPanel, queryBuilder, searchHelpTooltipTemplate, output,
             FilterListView, SearchView, ToolSuiteView, queryResultsView,
             ApiPanelView, filterModel, tagFilterModel, openToolSuiteView, landingView) {

        let displayLandingPage = function() {
            $(".header-btn.active").removeClass('active');
            $('#main-content').empty();

            var landing = new landingView();
            $('#main-content').append(landing.$el);
            landingView.render();
        };

        let displayOpenAccess = function() {
            sessionStorage.setItem("isOpenAccess", true);
            Backbone.pubSub.trigger('destroySearchView');
            $(".header-btn.active").removeClass('active');
            $(".header-btn[data-href='/picsureui/openAccess#']").addClass('active');
            $('#main-content').empty();
            $('#main-content').append(this.layoutTemplate(settings));
            let toolSuiteView = new openToolSuiteView({el: $('#tool-suite-panel')});
            toolSuiteView.render();

            const outputPanelView = new outputPanel.View({toolSuiteView: toolSuiteView});
            const query = queryBuilder.generateQueryNew({}, {}, null, settings.openAccessResourceId);
            outputPanelView.render();
            $('#query-results').append(outputPanelView.$el);

            const parsedSess = JSON.parse(sessionStorage.getItem("session"));

            const searchView = new SearchView({
                queryTemplate: JSON.parse(parsedSess.queryTemplate),
                queryScopes: parsedSess.queryScopes,
                el : $('#filter-list')
            });

            if($('#search-results-panel').is(":visible")) {
                $('#guide-me-button-container').hide();
            }

            const filterListView = new FilterListView({
                outputPanelView : outputPanelView,
                el : $('#filter-list-panel')
            });
            filterListView.render();
        };

        let displayAPI = function() {
            $(".header-btn.active").removeClass('active');
            $(".header-btn[data-href='/picsureui/api']").addClass('active');
            $('#main-content').empty();

            var apiPanelView = new ApiPanelView({});
            $('#main-content').append(apiPanelView.$el);
            apiPanelView.render();
        };

        return {
            routes : {
                /**
                 * Additional routes for the backbone router can be defined here. The field name should be the path,
                 * and the value should be a function.
                 *
                 * Ex:
                 * "picsureui/queryBuilder2" : function() { renderQueryBuilder2(); }
                 */
                "picsureui/openAccess" : function () {
                    displayOpenAccess.call(this);
                },
                "picsureui/queryBuilder(/)" : displayOpenAccess,
                "picsureui/api" : displayAPI,
            },
            defaultAction: displayLandingPage,
        };
    }
);
