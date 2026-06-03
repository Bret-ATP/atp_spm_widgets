/ Strategic Objectives Status
// Strategic Objectives Status Widget (Progress-Based + Preview Image)

tau.mashups
.addDependency('jQuery')
.addDependency('tau/configurator')
.addMashup(function ($, configurator) {

  var appConfigurator;

  configurator.getGlobalBus().on('configurator.ready', function (evt, readyConfigurator) {

    if (!appConfigurator && readyConfigurator._id && readyConfigurator._id.match(/board/)) {

      appConfigurator = readyConfigurator;

      readyConfigurator.getDashboardWidgetTemplateRegistry().addWidgetTemplate({

        id: 'so_status_color_bar_widget',

        name: 'Strategic Objectives Status',

        // ✅ ADD THIS LINE (your GitHub image)
        previewSrc: 'https://raw.githubusercontent.com/Bret-ATP/atp_spm_widgets/main/img/so_status_preview.png',

        description: 'Status summary of Strategic Objectives',

        tags: ['OKR', 'Strategic Objectives'],
        placeholder: 'restui_board',

        insert: function (placeholder, settings) {

          var props = {
            placeholder: placeholder,
            settings: settings || {}
          };

          // ---------- RENDER ----------
          function renderGauge(data) {

            var $container = $(props.placeholder);
            $container.empty();

            var percentage = data.percentage || 0;

            var statusColor, statusText;

            if (percentage >= 70) {
              statusColor = '#22c55e';
              statusText = 'On Track';
            } else if (percentage >= 40) {
              statusColor = '#f59e0b';
              statusText = 'At Risk';
            } else {
              statusColor = '#ef4444';
              statusText = 'Critical';
            }

            var $widget = $('<div>').css({
              padding: '20px',
              background: 'white',
              'border-radius': '8px',
              'font-family': 'Arial, sans-serif'
            });

            // Title
            $widget.append(
              $('<h3>').text(props.settings.title || 'Strategic Objectives Status')
            );

            // Center %
            var $center = $('<div>').css({
              'text-align': 'center',
              margin: '20px 0'
            });

            $center.append(
              $('<div>').text(percentage + '%').css({
                'font-size': '64px',
                'font-weight': 'bold',
                color: statusColor
              })
            );

            $center.append(
              $('<div>').text(statusText).css({
                'font-size': '18px',
                color: statusColor
              })
            );

            $widget.append($center);

            // Segmented bar
            var $bar = $('<div>').css({
              display: 'flex',
              height: '40px',
              'border-radius': '20px',
              overflow: 'hidden',
              margin: '20px 0'
            });

            var total = data.green + data.amber + data.red;

            var redWidth = total ? (data.red / total * 100) : 0;
            var amberWidth = total ? (data.amber / total * 100) : 0;
            var greenWidth = total ? (data.green / total * 100) : 0;

            $bar.append(
              $('<div>').css({ width: redWidth + '%', background: '#ef4444' })
            );

            $bar.append(
              $('<div>').css({ width: amberWidth + '%', background: '#f59e0b' })
            );

            $bar.append(
              $('<div>').css({ width: greenWidth + '%', background: '#22c55e' })
            );

            $widget.append($bar);

            // Legend (RED → ORANGE → GREEN)
            var $legend = $('<div>').css({
              display: 'flex',
              'justify-content': 'center',
              gap: '30px',
              'margin-top': '10px'
            });

            $legend.append($('<div>').text('🔴 Critical: ' + data.red));
            $legend.append($('<div>').text('🟠 At Risk: ' + data.amber));
            $legend.append($('<div>').text('🟢 On Track: ' + data.green));

            $widget.append($legend);

            $container.append($widget);
          }

          // ---------- DATA ----------
          function render() {

            $.ajax({
              url: '/api/v1/StrategicObjectives?include=[Progress]&format=json',
              type: 'GET',
              dataType: 'json'
            }).done(function (response) {

              var green = 0, amber = 0, red = 0;

              (response.Items || []).forEach(function (obj) {

                var progressRaw = (obj.Progress && obj.Progress.Value !== undefined)
                  ? obj.Progress.Value
                  : obj.Progress;

                var progress = progressRaw || 0;
                var progressPct = progress * 100;

                if (progressPct >= 70) {
                  green++;
                } else if (progressPct >= 40) {
                  amber++;
                } else {
                  red++;
                }

              });

              var total = green + amber + red;

              var percentage = total > 0
                ? Math.round(((green * 100) + (amber * 50)) / total)
                : 0;

              renderGauge({
                percentage: percentage,
                green: green,
                amber: amber,
                red: red
              });

            }).fail(function () {

              renderGauge({
                percentage: 0,
                green: 0,
                amber: 0,
                red: 0
              });

            });
          }

          render();

          return {
            update: render
          };
        }
      });
    }
  });
});

// Strategic Objectives Summary
// Strategic Objectives Summary (Progress-Based + Preview Image)

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

                // ✅ ADDED PREVIEW IMAGE (from your GitHub commit)
                previewSrc: 'https://raw.githubusercontent.com/Bret-ATP/atp_spm_widgets/1dfb4b32efe1a64da9f918c7a114619fcc903d35/img/so_status_summary_preview.png',

                description: 'Strategic Objectives grid with progress and status',

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

                        $widget.append(
                            $('<h3>').text(
                                props.settings.title || 'Strategic Objectives'
                            )
                        );

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
                            $card.append(
                                $('<div>').text(obj.name).css({
                                    'font-weight': '600'
                                })
                            );

                            // Status + %
                            var $row = $('<div>').css({
                                display: 'flex',
                                'justify-content': 'space-between',
                                'margin': '10px 0'
                            });

                            $row.append(
                                $('<div>').text(obj.status).css({
                                    background: color,
                                    color: 'white',
                                    padding: '4px 10px',
                                    'border-radius': '10px',
                                    'font-size': '12px'
                                })
                            );

                            $row.append(
                                $('<div>').text(obj.progress + '%').css({
                                    color: color,
                                    'font-weight': 'bold'
                                })
                            );

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

// Strategic OKR Summary
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
