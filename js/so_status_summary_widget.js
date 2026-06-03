// Strategic Objectives Summary (Progress-Based + Side-by-Side Preview)

tau.mashups
.addDependency('jQuery')
.addDependency('tau/configurator')
.addMashup(function($, configurator) {

    var appConfigurator;

    configurator.getGlobalBus().on('configurator.ready', function(evt, readyConfigurator) {
        if (!appConfigurator && readyConfigurator._id && readyConfigurator._id.match(/board/)) {
            appConfigurator = readyConfigurator;

            readyConfigurator.getDashboardWidgetTemplateRegistry().addWidgetTemplate({
                id: 'strategic_objectives_summary_progress',

                name: 'Strategic Objectives Summary',

                // ✅ SIDE-BY-SIDE "MULTI-CARD" PREVIEW
                description:
                    'Strategic Objctives grid with progress and status',

                tags: ['OKR', 'Strategic Objectives'],
                placeholder: 'restui_board',

                insert: function(placeholder, settings) {

                    var props = {
                        placeholder: placeholder,
                        settings: settings || {}
                    };

                    // ---------- RENDER ----------
                    var renderGrid = function(objectives) {

                        var $container = $(props.placeholder).empty();

                        var $widget = $('<div>').css({
                            padding: '20px',
                            background: 'white',
                            'border-radius': '8px'
                        });

                        $widget.append($('<h3>').text(
                            props.settings.title || 'Strategic Objectives'
                        ));

                        var $grid = $('<div>').css({
                            display: 'grid',
                            'grid-template-columns': 'repeat(3, 1fr)',
                            gap: '20px'
                        });

                        objectives.forEach(function(obj) {

                            var color = obj.color;

                            var $card = $('<div>').css({
                                padding: '15px',
                                background: '#f9fafb',
                                border: '1px solid #e5e7eb',
                                'border-radius': '8px'
                            });

                            // Title
                            $card.append($('<div>').text(obj.name).css({
                                'font-weight': '600'
                            }));

                            // Status + %
                            var $row = $('<div>').css({
                                display: 'flex',
                                'justify-content': 'space-between',
                                'margin': '10px 0'
                            });

                            $row.append($('<div>').text(obj.status).css({
                                background: color,
                                color: 'white',
                                padding: '4px 10px',
                                'border-radius': '10px',
                                'font-size': '12px'
                            }));

                            $row.append($('<div>').text(obj.progress + '%').css({
                                color: color,
                                'font-weight': 'bold'
                            }));

                            $card.append($row);

                            // Progress bar
                            $card.append(
                                $('<div>').css({
                                    height: '10px',
                                    background: '#e5e7eb',
                                    'border-radius': '5px'
                                }).append(
                                    $('<div>').css({
                                        width: obj.progress + '%',
                                        height: '100%',
                                        background: color
                                    })
                                )
                            );

                            $grid.append($card);
                        });

                        $widget.append($grid);
                        $container.append($widget);
                    };

                    // ---------- DATA ----------
                    var render = function() {

                        $.ajax({
                            url: '/api/v1/StrategicObjectives?include=[Name,Progress]&format=json',
                            type: 'GET',
                            dataType: 'json'
                        }).done(function(response) {

                            var objectives = [];

                            (response.Items || []).forEach(function(obj) {

                                var progressRaw = (obj.Progress && obj.Progress.Value !== undefined)
                                    ? obj.Progress.Value
                                    : obj.Progress;

                                var progress = progressRaw || 0;
                                var progressPct = Math.round(progress * 100);

                                // ✅ Derived status (portable)
                                var status, color;

                                if (progressPct >= 70) {
                                    status = 'On Track';
                                    color = '#22c55e';
                                } else if (progressPct >= 40) {
                                    status = 'At Risk';
                                    color = '#f59e0b';
                                } else {
                                    status = 'Critical';
                                    color = '#ef4444';
                                }

                                objectives.push({
                                    name: obj.Name,
                                    progress: progressPct,
                                    status: status,
                                    color: color
                                });
                            });

                            renderGrid(objectives);
                        });
                    };

                    render();
                    return { update: render };
                }
            });
        }
    });
});
