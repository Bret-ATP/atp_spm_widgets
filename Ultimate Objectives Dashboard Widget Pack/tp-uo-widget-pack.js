// ===========================================
// Ultimate Objectives Widget Pack
// Shared client-side EntityState filtering across Ultimate Objective widgets.
// Includes modal iframe cleanup with an 8px left inset so entity content is not clipped.
// ===========================================
(function () {
    var TP_OKR_SCOPE = 'UltimateObjective';
    var TP_OKR_EVENT = 'tpOkrUltimateObjectiveFilterChanged';
    window.tpOkrSharedFilters = window.tpOkrSharedFilters || {};
    window.tpOkrSharedFilters[TP_OKR_SCOPE] = window.tpOkrSharedFilters[TP_OKR_SCOPE] || { selectedStateIds: [] };

    function getSharedStateIds() { return (window.tpOkrSharedFilters[TP_OKR_SCOPE].selectedStateIds || []).slice(); }
    function setSharedStateIds(ids, sourceId) {
        var normalized = (ids || []).map(function (id) { return String(id); });
        window.tpOkrSharedFilters[TP_OKR_SCOPE].selectedStateIds = normalized;
        window.dispatchEvent(new CustomEvent(TP_OKR_EVENT, { detail: { scope: TP_OKR_SCOPE, sourceId: sourceId || null, selectedStateIds: normalized } }));
    }
    function getEntityState(obj) {
        var state = obj && obj.EntityState ? obj.EntityState : null;
        if (!state) return { id: '__none__', name: 'No State' };
        return { id: state.Id !== undefined && state.Id !== null ? String(state.Id) : '__none__', name: state.Name || 'No State' };
    }
    function getProgressPct(obj) {
        var progressRaw = (obj.Progress && obj.Progress.Value !== undefined) ? obj.Progress.Value : obj.Progress;
        return Math.round((progressRaw || 0) * 100);
    }
    function getStatusFromProgress(progressPct) {
        if (progressPct >= 70) return { status: 'On Track', color: '#22c55e' };
        if (progressPct >= 40) return { status: 'At Risk', color: '#f59e0b' };
        return { status: 'Critical', color: '#ef4444' };
    }
    function normalizeObjective(obj) {
        var progress = getProgressPct(obj);
        var rag = getStatusFromProgress(progress);
        var state = getEntityState(obj);
        return { id: obj.Id, name: obj.Name, progress: progress, status: rag.status, color: rag.color, stateId: state.id, stateName: state.name, raw: obj, keyResults: [] };
    }
    function filterByState(items, selectedStateIds) {
        if (!selectedStateIds || selectedStateIds.length === 0) return items || [];
        var selected = {};
        selectedStateIds.forEach(function (id) { selected[String(id)] = true; });
        return (items || []).filter(function (item) { return selected[String(item.stateId)] === true; });
    }
    function buildStateCounts(items) {
        var map = {};
        (items || []).forEach(function (item) {
            var id = String(item.stateId || '__none__');
            if (!map[id]) map[id] = { id: id, name: item.stateName || 'No State', count: 0 };
            map[id].count++;
        });
        return Object.keys(map).map(function (id) { return map[id]; }).sort(function (a, b) { return a.name.localeCompare(b.name); });
    }
    function renderStateFilterBar($parent, states, selectedStateIds, onChange) {
        var selected = {};
        (selectedStateIds || []).forEach(function (id) { selected[String(id)] = true; });
        var hasActiveFilter = (selectedStateIds || []).length > 0;
        var totalCount = 0;
        (states || []).forEach(function (state) { totalCount += state.count || 0; });
        var $bar = $('<div>').css({ display: 'flex', 'align-items': 'center', 'flex-wrap': 'wrap', gap: '8px', 'margin-bottom': '16px', 'font-family': 'Arial, sans-serif' });
        $bar.append($('<span>').text('State:').css({ 'font-weight': '700', color: '#374151', 'font-size': '13px', 'margin-right': '2px' }));
        $bar.append($('<span>').text('Total: ' + totalCount).css({ color: '#6b7280', 'font-size': '12px', 'font-weight': '600', 'margin-right': '6px' }));
        function makePill(label, active, clickHandler) {
            return $('<button>').text(label).css({ border: '1px solid ' + (active ? '#2563eb' : '#d1d5db'), background: active ? '#2563eb' : '#ffffff', color: active ? '#ffffff' : '#374151', 'border-radius': '999px', padding: '5px 10px', cursor: 'pointer', 'font-size': '12px', 'font-weight': '700', 'line-height': '1.2' }).on('click', function (e) { e.preventDefault(); e.stopPropagation(); clickHandler(); });
        }
        $bar.append(makePill('All', !hasActiveFilter, function () { onChange([]); }));
        (states || []).forEach(function (state) {
            var id = String(state.id);
            var active = selected[id] === true;
            $bar.append(makePill(state.name + ' (' + state.count + ')', active, function () {
                var next = (selectedStateIds || []).map(function (x) { return String(x); });
                var idx = next.indexOf(id);
                if (idx >= 0) next.splice(idx, 1); else next.push(id);
                onChange(next);
            }));
        });
        $parent.append($bar);
    }
    function getCustomFieldValue(obj, fieldName) {
        var fields = obj.CustomFields || [];
        for (var i = 0; i < fields.length; i++) if (fields[i].Name === fieldName) return fields[i].Value;
        return null;
    }
    function openEntityModal(entityPage, entityId, entityTitle) {
        if (!entityId) return;
        $('.tp-okr-modal-overlay').remove();
        var hash = window.location.hash || '';
        var appConfigMatch = hash.match(/(?:#|&)appConfig=([^&]+)/);
        var appConfigPart = appConfigMatch ? '&appConfig=' + appConfigMatch[1] : '';
        var baseUrl = window.location.origin + window.location.pathname + window.location.search;
        var iframeUrl = baseUrl + '#page=' + entityPage + '/' + entityId + appConfigPart;
        var $overlay = $('<div>').addClass('tp-okr-modal-overlay').css({ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(17, 24, 39, 0.55)', 'z-index': 999999, display: 'flex', 'justify-content': 'center', 'align-items': 'center' });
        var $modal = $('<div>').css({ width: '92vw', height: '92vh', background: '#ffffff', 'border-radius': '12px', 'box-shadow': '0 24px 80px rgba(0,0,0,0.35)', display: 'flex', 'flex-direction': 'column', overflow: 'hidden' });
        var $header = $('<div>').css({ display: 'flex', 'align-items': 'center', 'justify-content': 'space-between', padding: '12px 16px', background: '#f9fafb', border: '1px solid #e5e7eb', 'border-left': 'none', 'border-right': 'none', 'border-top': 'none', flex: '0 0 auto' });
        $header.append($('<div>').text(entityTitle || ('Entity #' + entityId)).css({ 'font-weight': '600', color: '#111827', 'font-size': '14px', 'white-space': 'nowrap', overflow: 'hidden', 'text-overflow': 'ellipsis', 'padding-right': '16px' }));
        var $close = $('<button>').text('Close').css({ background: '#111827', color: '#ffffff', border: 'none', 'border-radius': '8px', padding: '6px 12px', cursor: 'pointer', 'font-size': '12px', 'font-weight': '600' }).on('click', function () { $overlay.remove(); $(document).off('keydown.tpOkrModal'); });
        $header.append($close);
        var $frameWrap = $('<div>').css({ position: 'relative', flex: '1 1 auto', 'min-height': 0, background: '#ffffff', overflow: 'hidden' });
        var $loading = $('<div>').text('Loading details...').css({ position: 'absolute', top: '12px', left: '16px', color: '#6b7280', 'font-size': '13px', 'z-index': 1 });
        var $iframe = $('<iframe>').attr({ src: iframeUrl }).css({ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0, background: '#ffffff' });
        function injectTargetedEntityCleanup() {
            try {
                var iframe = $iframe[0];
                var doc = iframe.contentDocument || iframe.contentWindow.document;
                if (!doc || !doc.body) return false;
                var styleId = 'tp-okr-modal-targeted-entity-cleanup-style';
                if (!doc.getElementById(styleId)) {
                    var style = doc.createElement('style');
                    style.id = styleId;
                    style.type = 'text/css';
                    style.appendChild(doc.createTextNode('\
html, body { width: 100% !important; max-width: none !important; overflow-x: hidden !important; }\
.tau-app-secondary-pane, .tau-app-secondary-pane.i-role-aside, .i-role-aside, .tau-app-left-pane, .tau-app-sidebar, .tau-left-sidebar, .i-role-app-sidebar, .i-role-left-menu, .tau-app-navigation, .tau-navigation, .tau-nav, .tau-boardnavigation, .tau-board-navigation, .tau-folders, .tau-folder-navigation { display: none !important; visibility: hidden !important; width: 0 !important; min-width: 0 !important; max-width: 0 !important; flex: 0 0 0 !important; overflow: hidden !important; }\
.i-main.tau-app-main-pane, .tau-app-main-pane, [role="main"], .tau-page-single, .tau-page-entity, .tau-app, .tau-app-body, .tau-page { left: 0 !important; margin-left: 0 !important; padding-left: 8px !important; box-sizing: border-box !important; width: calc(100% - 8px) !important; max-width: none !important; }\
.tau-app.tau-page-single.tau-page-entity, .tau-page-single.tau-page-entity, .tau-page-entity { display: block !important; }\
'));
                    (doc.head || doc.documentElement).appendChild(style);
                }
                var sidePanes = doc.querySelectorAll('.tau-app-secondary-pane, .tau-app-secondary-pane.i-role-aside, .i-role-aside, .tau-app-left-pane, .tau-app-sidebar, .tau-left-sidebar, .i-role-app-sidebar, .i-role-left-menu, .tau-app-navigation, .tau-navigation, .tau-nav, .tau-boardnavigation, .tau-board-navigation, .tau-folders, .tau-folder-navigation');
                for (var i = 0; i < sidePanes.length; i++) {
                    sidePanes[i].style.display = 'none'; sidePanes[i].style.visibility = 'hidden'; sidePanes[i].style.width = '0'; sidePanes[i].style.minWidth = '0'; sidePanes[i].style.maxWidth = '0'; sidePanes[i].style.overflow = 'hidden';
                }
                var mainPanes = doc.querySelectorAll('.i-main.tau-app-main-pane, .tau-app-main-pane, [role="main"], .tau-page-single, .tau-page-entity, .tau-app-body, .tau-page');
                for (var j = 0; j < mainPanes.length; j++) {
                    mainPanes[j].style.left = '0'; mainPanes[j].style.marginLeft = '0'; mainPanes[j].style.paddingLeft = '8px'; mainPanes[j].style.boxSizing = 'border-box'; mainPanes[j].style.width = 'calc(100% - 8px)'; mainPanes[j].style.maxWidth = 'none';
                }
                return true;
            } catch (e) { return false; }
        }
        $iframe.on('load', function () {
            $loading.hide();
            var attempts = 0;
            var cleanupInterval = setInterval(function () {
                attempts++;
                var ok = injectTargetedEntityCleanup();
                if (ok && attempts > 8) clearInterval(cleanupInterval);
                if (attempts >= 40) clearInterval(cleanupInterval);
            }, 250);
        });
        $frameWrap.append($loading).append($iframe);
        $modal.append($header).append($frameWrap);
        $overlay.append($modal).on('click', function (e) { if (e.target === $overlay[0]) { $overlay.remove(); $(document).off('keydown.tpOkrModal'); } });
        $('body').append($overlay);
        $(document).off('keydown.tpOkrModal').on('keydown.tpOkrModal', function (e) { if (e.key === 'Escape') { $('.tp-okr-modal-overlay').remove(); $(document).off('keydown.tpOkrModal'); } });
    }
    function registerSharedFilterListener(widgetId, applyFn) {
        window.addEventListener(TP_OKR_EVENT, function (event) {
            if (!event.detail || event.detail.scope !== TP_OKR_SCOPE || event.detail.sourceId === widgetId) return;
            applyFn((event.detail.selectedStateIds || []).map(function (id) { return String(id); }));
        });
    }
    function loadObjectives(includeCustomFields, done, fail) {
        var include = includeCustomFields ? '[Id,Name,Progress,EntityState,CustomFields]' : '[Id,Name,Progress,EntityState]';
        $.ajax({ url: '/api/v1/UltimateObjectives?include=' + include + '&format=json', type: 'GET', dataType: 'json' }).done(function (response) {
            done((response.Items || []).map(normalizeObjective));
        }).fail(function () { if (fail) fail(); else done([]); });
    }
    function renderObjectiveCard(obj, includeStateLabel) {
        var $card = $('<div>').css({ padding: '15px', background: '#f9fafb', border: '1px solid #e5e7eb', 'border-radius': '8px', cursor: 'pointer', transition: 'all 0.15s ease' }).attr('title', 'Click to open Ultimate Objective').hover(function () { $(this).css({ transform: 'translateY(-2px)', 'box-shadow': '0 6px 16px rgba(0,0,0,0.1)' }); }, function () { $(this).css({ transform: 'none', 'box-shadow': 'none' }); }).on('click', function () { openEntityModal('ultimateobjective', obj.id, obj.name); });
        $card.append($('<div>').text(obj.name).css({ 'font-weight': '600', 'font-size': '14px' }));
        if (includeStateLabel) $card.append($('<div>').text(obj.stateName).css({ color: '#6b7280', 'font-size': '11px', 'margin-top': '4px' }));
        var $row = $('<div>').css({ display: 'flex', 'justify-content': 'space-between', margin: '10px 0' });
        $row.append($('<div>').text(obj.status).css({ background: obj.color, color: 'white', padding: '4px 10px', 'border-radius': '10px', 'font-size': '12px' }));
        $row.append($('<div>').text(obj.progress + '%').css({ color: obj.color, 'font-weight': 'bold' }));
        $card.append($row);
        $card.append($('<div>').css({ height: '10px', background: '#e5e7eb', 'border-radius': '5px', overflow: 'hidden' }).append($('<div>').css({ width: obj.progress + '%', height: '100%', background: obj.color })));
        return $card;
    }
    function renderKrRow($card, kr) {
        var progress = getProgressPct(kr);
        var rag = getStatusFromProgress(progress);
        var units = getCustomFieldValue(kr, 'Unit') || getCustomFieldValue(kr, 'Units') || '';
        var start = getCustomFieldValue(kr, 'Start') || '';
        var current = getCustomFieldValue(kr, 'Current') || '';
        var target = getCustomFieldValue(kr, 'Target') || '';
        var $kr = $('<div>').css({ 'margin-top': '12px', cursor: 'pointer' }).attr('title', 'Click to open Key Result').on('click', function (e) { e.stopPropagation(); openEntityModal('keyresult', kr.Id, kr.Name); });
        var $top = $('<div>').css({ display: 'flex', 'justify-content': 'space-between', gap: '8px', 'font-size': '12px' });
        $top.append($('<div>').text(kr.Name).css({ color: '#374151', 'font-weight': '600' }));
        $top.append($('<div>').text(progress + '%').css({ color: rag.color, 'font-weight': '700' }));
        $kr.append($top);
        var detail = [];
        if (start !== '') detail.push('Start: ' + start);
        if (current !== '') detail.push('Current: ' + current);
        if (target !== '') detail.push('Target: ' + target);
        if (units !== '') detail.push(units);
        if (detail.length) $kr.append($('<div>').text(detail.join('  ')).css({ color: '#6b7280', 'font-size': '11px', 'margin-top': '2px' }));
        $kr.append($('<div>').css({ height: '5px', background: '#e5e7eb', 'border-radius': '999px', overflow: 'hidden', 'margin-top': '5px' }).append($('<div>').css({ width: progress + '%', height: '100%', background: rag.color })));
        $card.append($kr);
    }
    function registerStatusWidget($, readyConfigurator) {
        readyConfigurator.getDashboardWidgetTemplateRegistry().addWidgetTemplate({ id: 'uo_status_color_bar_widget', name: 'Ultimate Objectives Status', previewSrc: 'https://raw.githubusercontent.com/Bret-ATP/atp_spm_widgets/main/img/so_status_preview.png', description: 'Status summary of Ultimate Objectives', tags: ['OKR', 'Ultimate Objectives'], placeholder: 'restui_board', insert: function (placeholder, settings) {
            var props = { placeholder: placeholder, settings: settings || {} };
            var widgetId = 'uo-status-' + Math.random().toString(36).slice(2);
            var allObjectives = [];
            var activeStateIds = getSharedStateIds();
            function renderGauge() {
                var objectives = filterByState(allObjectives, activeStateIds);
                var green = 0, amber = 0, red = 0;
                objectives.forEach(function (obj) { if (obj.progress >= 70) green++; else if (obj.progress >= 40) amber++; else red++; });
                var total = green + amber + red;
                var fullTotal = allObjectives.length;
                var percentage = total > 0 ? Math.round(((green * 100) + (amber * 50)) / total) : 0;
                var status = getStatusFromProgress(percentage);
                var selectionText = activeStateIds.length > 0 ? (total + ' of ' + fullTotal + ' Ultimate Objectives') : (total + ' Ultimate Objectives');
                var $container = $(props.placeholder).empty();
                var $widget = $('<div>').css({ padding: '20px', background: 'white', 'border-radius': '8px', 'font-family': 'Arial, sans-serif' });
                renderStateFilterBar($widget, buildStateCounts(allObjectives), activeStateIds, function (nextStateIds) { activeStateIds = nextStateIds; setSharedStateIds(activeStateIds, widgetId); renderGauge(); });
                var $center = $('<div>').css({ 'text-align': 'center', margin: '20px 0 22px' });
                $center.append($('<div>').text(percentage + '%').css({ 'font-size': '64px', 'font-weight': 'bold', color: status.color, 'line-height': '1' }));
                $center.append($('<div>').text(status.status).css({ 'font-size': '18px', color: status.color, 'margin-top': '8px' }));
                $center.append($('<div>').text(selectionText).css({ 'font-size': '13px', color: '#6b7280', 'font-weight': '600', 'margin-top': '8px' }));
                $widget.append($center);
                var $bar = $('<div>').css({ display: 'flex', height: '40px', 'border-radius': '20px', overflow: 'hidden', margin: '20px 0' });
                $bar.append($('<div>').css({ width: (total ? (red / total * 100) : 0) + '%', background: '#ef4444' }));
                $bar.append($('<div>').css({ width: (total ? (amber / total * 100) : 0) + '%', background: '#f59e0b' }));
                $bar.append($('<div>').css({ width: (total ? (green / total * 100) : 0) + '%', background: '#22c55e' }));
                $widget.append($bar);
                var $legend = $('<div>').css({ display: 'flex', 'justify-content': 'center', gap: '30px', 'margin-top': '10px', 'flex-wrap': 'wrap' });
                $legend.append($('<div>').text('🔴 Critical: ' + red));
                $legend.append($('<div>').text('🟠 At Risk: ' + amber));
                $legend.append($('<div>').text('🟢 On Track: ' + green));
                $widget.append($legend);
                $container.append($widget);
            }
            function render() { loadObjectives(false, function (items) { allObjectives = items; renderGauge(); }); }
            registerSharedFilterListener(widgetId, function (ids) { activeStateIds = ids; renderGauge(); });
            render();
            return { update: render };
        }});
    }
    function registerSummaryWidget($, readyConfigurator) {
        readyConfigurator.getDashboardWidgetTemplateRegistry().addWidgetTemplate({ id: 'ultimate_objectives_summary_progress', name: 'Ultimate Objectives Summary', previewSrc: 'https://raw.githubusercontent.com/Bret-ATP/atp_spm_widgets/1dfb4b32efe1a64da9f918c7a114619fcc903d35/img/so_status_summary_preview.png', description: 'Ultimate Objectives grid with progress and status', tags: ['OKR', 'Ultimate Objectives'], placeholder: 'restui_board', insert: function (placeholder, settings) {
            var props = { placeholder: placeholder, settings: settings || {} };
            var widgetId = 'uo-summary-' + Math.random().toString(36).slice(2);
            var allObjectives = [];
            var activeStateIds = getSharedStateIds();
            function renderGrid() {
                var $container = $(props.placeholder).empty();
                var $widget = $('<div>').css({ padding: '20px', background: 'white', 'border-radius': '8px', 'font-family': 'Arial, sans-serif' });
                renderStateFilterBar($widget, buildStateCounts(allObjectives), activeStateIds, function (nextStateIds) { activeStateIds = nextStateIds; setSharedStateIds(activeStateIds, widgetId); renderGrid(); });
                var objectives = filterByState(allObjectives, activeStateIds);
                if (objectives.length === 0) { $widget.append($('<div>').text('No Ultimate Objectives match the selected state filter.').css({ color: '#6b7280', padding: '16px 0' })); $container.append($widget); return; }
                var $grid = $('<div>').css({ display: 'grid', 'grid-template-columns': 'repeat(3, 1fr)', gap: '20px' });
                objectives.forEach(function (obj) { $grid.append(renderObjectiveCard(obj, true)); });
                $widget.append($grid);
                $container.append($widget);
            }
            function render() { loadObjectives(false, function (items) { allObjectives = items; renderGrid(); }); }
            registerSharedFilterListener(widgetId, function (ids) { activeStateIds = ids; renderGrid(); });
            render();
            return { update: render };
        }});
    }
    function registerOkrWidget($, readyConfigurator) {
        readyConfigurator.getDashboardWidgetTemplateRegistry().addWidgetTemplate({ id: 'ultimate_objectives_grid_krs', name: 'Ultimate OKR Summary', previewSrc: 'https://raw.githubusercontent.com/Bret-ATP/atp_spm_widgets/37891ae2093ff8d61637ded01e2872294e3c990a/img/so_status_summary_kr_preview.png', description: 'Ultimate Objectives with Key Results', tags: ['OKR', 'Ultimate Objectives'], placeholder: 'restui_board', insert: function (placeholder, settings) {
            var props = { placeholder: placeholder, settings: settings || {} };
            var widgetId = 'uo-okr-' + Math.random().toString(36).slice(2);
            var allObjectives = [];
            var activeStateIds = getSharedStateIds();
            function renderGrid() {
                var $container = $(props.placeholder).empty();
                var $widget = $('<div>').css({ padding: '20px', background: 'white', 'border-radius': '8px', 'font-family': 'Arial, sans-serif' });
                renderStateFilterBar($widget, buildStateCounts(allObjectives), activeStateIds, function (nextStateIds) { activeStateIds = nextStateIds; setSharedStateIds(activeStateIds, widgetId); renderGrid(); });
                var objectives = filterByState(allObjectives, activeStateIds);
                if (objectives.length === 0) { $widget.append($('<div>').text('No Ultimate Objectives match the selected state filter.').css({ color: '#6b7280', padding: '16px 0' })); $container.append($widget); return; }
                var $grid = $('<div>').css({ display: 'grid', 'grid-template-columns': 'repeat(3, 1fr)', gap: '20px' });
                objectives.forEach(function (obj) {
                    var $card = renderObjectiveCard(obj, true);
                    if (!obj.keyResults || obj.keyResults.length === 0) $card.append($('<div>').text('No Key Results').css({ color: '#9ca3af', 'font-size': '12px', 'margin-top': '10px' }));
                    else obj.keyResults.forEach(function (kr) { renderKrRow($card, kr); });
                    $grid.append($card);
                });
                $widget.append($grid);
                $container.append($widget);
            }
            function loadKeyResultsForObjectives(objectives, done) {
                var remaining = objectives.length;
                if (remaining === 0) { done(); return; }
                objectives.forEach(function (obj) {
                    $.ajax({ url: '/api/v1/UltimateObjectives/' + obj.id + '/KeyResults?include=[Id,Name,Progress,CustomFields]&format=json', type: 'GET', dataType: 'json' }).done(function (response) { obj.keyResults = response.Items || []; }).fail(function () { obj.keyResults = []; }).always(function () { remaining--; if (remaining === 0) done(); });
                });
            }
            function render() { loadObjectives(true, function (items) { allObjectives = items; renderGrid(); loadKeyResultsForObjectives(allObjectives, renderGrid); }); }
            registerSharedFilterListener(widgetId, function (ids) { activeStateIds = ids; renderGrid(); });
            render();
            return { update: render };
        }});
    }
    function registerAll($, configurator) {
        var appConfigurator;
        configurator.getGlobalBus().on('configurator.ready', function (evt, readyConfigurator) {
            if (!appConfigurator && readyConfigurator._id && readyConfigurator._id.match(/board/)) {
                appConfigurator = readyConfigurator;
                registerStatusWidget($, readyConfigurator);
                registerSummaryWidget($, readyConfigurator);
                registerOkrWidget($, readyConfigurator);
            }
        });
    }
    tau.mashups.addDependency('jQuery').addDependency('tau/configurator').addMashup(function ($, configurator) { registerAll($, configurator); });
})();
