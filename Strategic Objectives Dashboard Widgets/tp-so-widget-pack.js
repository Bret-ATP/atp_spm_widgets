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
...paste so_status_summary_widget.js content...

// Strategic OKR Summary
...paste so_status_summary_kr_widget.js content...
