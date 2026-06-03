// ===========================================
// Strategic Objectives Status Widget
// ===========================================

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

        previewSrc: 'https://raw.githubusercontent.com/Bret-ATP/atp_spm_widgets/main/img/so_status_preview.png',

        description: 'Status summary of Strategic Objectives',

        tags: ['OKR', 'Strategic Objectives'],
        placeholder: 'restui_board',

        insert: function (placeholder, settings) {

          var props = {
            placeholder: placeholder,
            settings: settings || {}
          };

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

            $widget.append(
              $('<h3>').text(props.settings.title || 'Strategic Objectives Status')
            );

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

            $bar.append($('<div>').css({ width: redWidth + '%', background: '#ef4444' }));
            $bar.append($('<div>').css({ width: amberWidth + '%', background: '#f59e0b' }));
            $bar.append($('<div>').css({ width: greenWidth + '%', background: '#22c55e' }));

            $widget.append($bar);

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

                var progressPct = (progressRaw || 0) * 100;

                if (progressPct >= 70) green++;
                else if (progressPct >= 40) amber++;
                else red++;
              });

              var total = green + amber + red;

              var percentage = total > 0
                ? Math.round(((green * 100) + (amber * 50)) / total)
                : 0;

              renderGauge({ percentage, green, amber, red });

            }).fail(function () {
              renderGauge({ percentage: 0, green: 0, amber: 0, red: 0 });
            });
          }

          render();

          return { update: render };
        }
      });
    }
  });
});


// ===========================================
// Strategic Objectives Summary Widget
// ===========================================

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

                previewSrc: 'https://raw.githubusercontent.com/Bret-ATP/atp_spm_widgets/1dfb4b32efe1a64da9f918c7a114619fcc903d35/img/so_status_summary_preview.png',

                description: 'Strategic Objectives grid with progress and status',

                tags: ['OKR', 'Strategic Objectives'],
                placeholder: 'restui_board',

                insert: function(placeholder, settings) {

                    var props = {
                        placeholder: placeholder,
                        settings: settings || {}
                    };

                    var render = function() {

                        $.ajax({
                            url: '/api/v1/StrategicObjectives?include=[Name,Progress]&format=json',
                            type: 'GET',
                            dataType: 'json'
                        }).done(function(response) {

                            var $container = $(props.placeholder).empty();

                            var $grid = $('<div>').css({
                                display: 'grid',
                                'grid-template-columns': 'repeat(3, 1fr)',
                                gap: '20px',
                                padding: '20px'
                            });

                            (response.Items || []).forEach(function(obj) {

                                var progressRaw = obj.Progress?.Value ?? obj.Progress ?? 0;
                                var progress = Math.round(progressRaw * 100);

                                var color =
                                    progress >= 70 ? '#22c55e' :
                                    progress >= 40 ? '#f59e0b' :
                                    '#ef4444';

                                var status =
                                    progress >= 70 ? 'On Track' :
                                    progress >= 40 ? 'At Risk' :
                                    'Critical';

                                var $card = $('<div>').css({
                                    padding: '15px',
                                    background: '#f9fafb',
                                    border: '1px solid #e5e7eb',
                                    'border-radius': '8px'
                                });

                                $card.append($('<div>').text(obj.Name).css({ 'font-weight': '600' }));

                                $card.append(
                                    $('<div>').text(status).css({
                                        background: color,
                                        color: 'white',
                                        padding: '4px 10px',
                                        'border-radius': '10px',
                                        'font-size': '12px',
                                        'margin': '10px 0'
                                    })
                                );

                                $card.append(
                                    $('<div>').css({
                                        height: '10px',
                                        background: '#e5e7eb',
                                        'border-radius': '5px'
                                    }).append(
                                        $('<div>').css({
                                            width: progress + '%',
                                            height: '100%',
                                            background: color
                                        })
                                    )
                                );

                                $grid.append($card);
                            });

                            $container.append($grid);
                        });
                    };

                    render();
                    return { update: render };
                }
            });
        }
    });
});


// ===========================================
// Strategic OKR Summary Widget
// ===========================================

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

                previewSrc: 'https://raw.githubusercontent.com/Bret-ATP/atp_spm_widgets/37891ae2093ff8d61637ded01e2872294e3c990a/img/so_status_summary_kr_preview.png',

                description: 'Strategic Objectives with Key Results',

                tags: ['OKR', 'Strategic Objectives'],
                placeholder: 'restui_board',

                insert: function (placeholder, settings) {

                    var props = {
                        placeholder,
                        settings: settings || {}
                    };

                    var getStatus = function (p) {
                        return p >= 70 ? { s: 'On Track', c: '#22c55e' }
                             : p >= 40 ? { s: 'At Risk', c: '#f59e0b' }
                             : { s: 'Critical', c: '#ef4444' };
                    };

                    var render = function () {

                        $.ajax({
                            url: '/api/v1/StrategicObjectives?include=[Id,Name,Progress]&format=json'
                        }).done(function (res) {

                            var $container = $(props.placeholder).empty();
                            var $grid = $('<div>').css({
                                display: 'grid',
                                'grid-template-columns': 'repeat(3, 1fr)',
                                gap: '20px',
                                padding: '20px'
                            });

                            (res.Items || []).forEach(function (obj) {

                                var p = Math.round((obj.Progress?.Value ?? obj.Progress ?? 0) * 100);
                                var st = getStatus(p);

                                var $card = $('<div>').css({
                                    padding: '15px',
                                    background: '#f9fafb',
                                    border: '1px solid #e5e7eb',
                                    'border-radius': '8px'
                                });

                                $card.append($('<div>').text(obj.Name).css({ 'font-weight': '600' }));

                                $card.append($('<div>').text(st.s).css({
                                    background: st.c,
                                    color: '#fff',
                                    padding: '4px 10px',
                                    'border-radius': '10px',
                                    'margin': '10px 0'
                                }));

                                $grid.append($card);

                                $.ajax({
                                    url: '/api/v1/StrategicObjectives/' + obj.Id + '/KeyResults?include=[Name,Progress]&format=json'
                                }).done(function (krRes) {

                                    (krRes.Items || []).forEach(function (kr) {

                                        var kp = Math.round((kr.Progress?.Value ?? kr.Progress ?? 0) * 100);
                                        var ks = getStatus(kp);

                                        var $kr = $('<div>').text('• ' + kr.Name + ' (' + kp + '%)').css({
                                            'font-size': '12px',
                                            color: ks.c,
                                            margin: '5px 0'
                                        });

                                        $card.append($kr);
                                    });

                                });

                            });

                            $container.append($grid);
                        });
                    };

                    render();
                    return { update: render };
                }
            });
        }
    });
});
