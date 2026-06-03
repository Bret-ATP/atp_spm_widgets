// Strategic Objectives + Key Results (Progress-Based + Preview Image)

tau.mashups
.addDependency('jQuery')
.addDependency('tau/configurator')
.addMashup(function ($, configurator) {

    var appConfigurator;

    configurator.getGlobalBus().on('configurator.ready', function (evt, readyConfigurator) {

        if (!appConfigurator && readyConfigurator._id && readyConfigurator._id.match(/board/)) {

            appConfigurator = readyConfigurator;

            readyConfigurator.getDashboardWidgetTemplateRegistry().addWidgetTemplate({

                id: 'strategic_objectives_grid_krs',

                name: 'Strategic OKR Summary',

                // ✅ Preview image (commit-locked GitHub raw URL)
                previewSrc: 'https://raw.githubusercontent.com/Bret-ATP/atp_spm_widgets/37891ae2093ff8d61637ded01e2872294e3c990a/img/so_status_summary_kr_preview.png',

                description: 'Strategic Objectives with Key Results',

                tags: ['OKR', 'Strategic Objectives'],
                placeholder: 'restui_board',

                insert: function (placeholder, settings) {

                    var props = {
                        placeholder: placeholder,
                        settings: settings || {}
                    };

                    // ---------- HELPERS ----------

                    var getField = function (fields, name) {
                        if (!fields) return null;
                        for (var i = 0; i < fields.length; i++) {
                            if (fields[i].Name === name) return fields[i].Value;
                        }
                        return null;
                    };

                    var formatNumber = function (value) {
                        if (value === null || value === undefined) return '0';

                        var num = parseFloat(value);
                        if (isNaN(num)) return value;

                        if (num % 1 === 0) return num.toString();

                        return num.toFixed(2);
                    };

                    // ✅ Unified progress → status logic
                    var getStatusFromProgress = function (pct) {

                        if (pct >= 70) {
                            return { status: 'On Track', color: '#22c55e' };
                        } else if (pct >= 40) {
                            return { status: 'At Risk', color: '#f59e0b' };
                        } else {
                            return { status: 'Critical', color: '#ef4444' };
                        }
                    };

                    // ---------- RENDER ----------

                    var render = function () {

                        $.ajax({
                            url: '/api/v1/StrategicObjectives?include=[Id,Name,Progress,CustomFields]&format=json',
                            type: 'GET',
                            dataType: 'json'
                        }).done(function (response) {

                            var $container = $(props.placeholder);
                            $container.empty();

                            var $widget = $('<div>').css({
                                padding: '20px',
                                background: 'white',
                                'border-radius': '8px'
                            });

                            $widget.append(
                                $('<h3>').text(
                                    props.settings.title || 'Strategic Objectives'
                                ).css({
                                    'margin-bottom': '20px'
                                })
                            );

                            var $grid = $('<div>').css({
                                display: 'grid',
                                'grid-template-columns': 'repeat(3, 1fr)',
                                gap: '20px'
                            });

                            (response.Items || []).forEach(function (obj) {

                                var progressRaw = (obj.Progress && obj.Progress.Value !== undefined)
                                    ? obj.Progress.Value
                                    : obj.Progress;

                                var progress = Math.round((progressRaw || 0) * 100);

                                var soStatus = getStatusFromProgress(progress);

                                var $card = $('<div>').css({
                                    padding: '15px',
                                    background: '#f9fafb',
                                    'border-radius': '8px',
                                    border: '1px solid #e5e7eb'
                                });

                                // OBJECTIVE HEADER
                                $card.append(
                                    $('<div>').text(obj.Name).css({
                                        'font-weight': '600',
                                        'margin-bottom': '10px'
                                    })
                                );

                                var $row = $('<div>').css({
                                    display: 'flex',
                                    'justify-content': 'space-between',
                                    'margin-bottom': '8px'
                                });

                                $row.append(
                                    $('<div>').text(soStatus.status).css({
                                        background: soStatus.color,
                                        color: 'white',
                                        padding: '4px 10px',
                                        'border-radius': '10px',
                                        'font-size': '12px'
                                    })
                                );

                                $row.append(
                                    $('<div>').text(progress + '%').css({
                                        color: soStatus.color,
                                        'font-weight': 'bold'
                                    })
                                );

                                $card.append($row);

                                // Progress bar
                                $card.append(
                                    $('<div>').css({
                                        height: '10px',
                                        background: '#e5e7eb',
                                        'border-radius': '5px',
                                        'margin-bottom': '12px'
                                    }).append(
                                        $('<div>').css({
                                            width: progress + '%',
                                            height: '100%',
                                            background: soStatus.color
                                        })
                                    )
                                );

                                // -------- KEY RESULTS --------

                                $.ajax({
                                    url: '/api/v1/StrategicObjectives/' + obj.Id + '/KeyResults?include=[Name,Progress,CustomFields]&format=json',
                                    type: 'GET',
                                    dataType: 'json'
                                }).done(function (krResponse) {

                                    (krResponse.Items || []).forEach(function (kr) {

                                        var krProgressRaw = (kr.Progress && kr.Progress.Value !== undefined)
                                            ? kr.Progress.Value
                                            : kr.Progress;

                                        var krProgress = Math.round((krProgressRaw || 0) * 100);

                                        var krStatus = getStatusFromProgress(krProgress);
                                        var resultType = getField(kr.CustomFields, 'Result Type');

                                        var $kr = $('<div>').css({
                                            'margin-bottom': '12px',
                                            'font-size': '12px'
                                        });

                                        var $hdr = $('<div>').css({
                                            display: 'flex',
                                            'justify-content': 'space-between',
                                            'align-items': 'center'
                                        });

                                        var $nameBlock = $('<div>').css({
                                            display: 'flex',
                                            'align-items': 'center',
                                            gap: '6px'
                                        });

                                        $nameBlock.append(
                                            $('<div>').text(kr.Name)
                                        );

                                        if (resultType) {
                                            $nameBlock.append(
                                                $('<div>').text(resultType).css({
                                                    'font-size': '10px',
                                                    'background': '#e5e7eb',
                                                    'padding': '2px 6px',
                                                    'border-radius': '6px',
                                                    'font-weight': '600'
                                                })
                                            );
                                        }

                                        $hdr.append($nameBlock);

                                        $hdr.append(
                                            $('<div>').text(krProgress + '%').css({
                                                color: krStatus.color,
                                                'font-weight': '600'
                                            })
                                        );

                                        $kr.append($hdr);

                                        $kr.append(
                                            $('<div>').text(
                                                'Start: ' + formatNumber(getField(kr.CustomFields, 'Start Value')) +
                                                '   Current: ' + formatNumber(getField(kr.CustomFields, 'Current Value')) +
                                                '   Target: ' + formatNumber(getField(kr.CustomFields, 'Target Value'))
                                            ).css({
                                                'font-size': '11px',
                                                color: '#666'
                                            })
                                        );

                                        // KR Progress bar
                                        $kr.append(
                                            $('<div>').css({
                                                height: '6px',
                                                background: '#e5e7eb',
                                                'border-radius': '3px',
                                                'margin-top': '4px'
                                            }).append(
                                                $('<div>').css({
                                                    width: krProgress + '%',
                                                    height: '100%',
                                                    background: krStatus.color
                                                })
                                            )
                                        );

                                        $card.append($kr);
                                    });

                                });

                                $grid.append($card);
                            });

                            $widget.append($grid);
                            $container.append($widget);

                        }).fail(function () {
                            console.error('Failed to load Strategic Objectives');
                        });
                    };

                    render();

                    return { update: render };
                }
            });
        }
    });
});