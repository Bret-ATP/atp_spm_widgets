// ===========================================
// Tactical Objectives Status Widget
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
id: 'to_status_color_bar_widget',
name: 'Tactical Objectives Status',
previewSrc: 'https://raw.githubusercontent.com/Bret-ATP/atp_spm_widgets/main/img/so_status_preview.png',
description: 'Status summary of Tactical Objectives',
tags: ['OKR', 'Tactical Objectives'],
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
url: '/api/v1/TacticalObjectives?include=[Progress]&format=json',
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


// ===========================================
// Tactical Objectives Summary Widget
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

id: 'tactical_objectives_summary_progress',
name: 'Tactical Objectives Summary',
previewSrc: 'https://raw.githubusercontent.com/Bret-ATP/atp_spm_widgets/1dfb4b32efe1a64da9f918c7a114619fcc903d35/img/so_status_summary_preview.png',
description: 'Tactical Objectives grid with progress and status',
tags: ['OKR', 'Tactical Objectives'],
placeholder: 'restui_board',

insert: function(placeholder, settings) {

var props = {
placeholder: placeholder,
settings: settings || {}
};

// === INTERACTIVITY HELPER: open entity in dashboard modal iframe ===
var openEntityModal = function (entityPage, entityId, entityTitle) {
if (!entityId) return;

$('.tp-okr-modal-overlay').remove();

var hash = window.location.hash || '';
var appConfigMatch = hash.match(/(?:#|&)appConfig=([^&]+)/);
var appConfigPart = appConfigMatch ? '&appConfig=' + appConfigMatch[1] : '';

var baseUrl = window.location.origin + window.location.pathname + window.location.search;
var iframeUrl = baseUrl + '#page=' + entityPage + '/' + entityId + appConfigPart;

var $overlay = $('<div>').addClass('tp-okr-modal-overlay').css({
position: 'fixed',
top: 0,
left: 0,
right: 0,
bottom: 0,
background: 'rgba(17, 24, 39, 0.55)',
'z-index': 999999,
display: 'flex',
'justify-content': 'center',
'align-items': 'center'
});

var $modal = $('<div>').css({
width: '92vw',
height: '92vh',
background: '#ffffff',
'border-radius': '12px',
'box-shadow': '0 24px 80px rgba(0,0,0,0.35)',
display: 'flex',
'flex-direction': 'column',
overflow: 'hidden'
});

var $header = $('<div>').css({
display: 'flex',
'align-items': 'center',
'justify-content': 'space-between',
padding: '12px 16px',
background: '#f9fafb',
border: '1px solid #e5e7eb',
'border-left': 'none',
'border-right': 'none',
'border-top': 'none',
'flex': '0 0 auto'
});

$header.append(
$('<div>').text(entityTitle || ('Entity #' + entityId)).css({
'font-weight': '600',
color: '#111827',
'font-size': '14px',
'white-space': 'nowrap',
overflow: 'hidden',
'text-overflow': 'ellipsis',
'padding-right': '16px'
})
);

var $close = $('<button>').text('Close').css({
background: '#111827',
color: '#ffffff',
border: 'none',
'border-radius': '8px',
padding: '6px 12px',
cursor: 'pointer',
'font-size': '12px',
'font-weight': '600'
});

$close.on('click', function () {
$overlay.remove();
});

$header.append($close);

var $frameWrap = $('<div>').css({
position: 'relative',
flex: '1 1 auto',
'min-height': 0,
background: '#ffffff',
overflow: 'hidden'
});

var $loading = $('<div>').text('Loading details...').css({
position: 'absolute',
top: '12px',
left: '16px',
color: '#6b7280',
'font-size': '13px',
'z-index': 1
});

var $iframe = $('<iframe>').attr({
src: iframeUrl
}).css({
position: 'absolute',
top: 0,
left: 0,
width: '100%',
height: '100%',
border: '0',
background: '#ffffff'
});

var injectTargetedEntityCleanup = function () {
try {
var iframe = $iframe[0];
var doc = iframe.contentDocument || iframe.contentWindow.document;
if (!doc || !doc.body) return false;

var entityContent = doc.querySelector('.tau-app.tau-page-single.tau-page-entity.i-role-entity-view-container, .tau-page-single.tau-page-entity, .tau-page-entity');
var mainPane = doc.querySelector('.i-main.tau-app-main-pane, .tau-app-main-pane, [role="main"]');
var sidePane = doc.querySelector('.tau-app-secondary-pane.i-role-aside, .tau-app-secondary-pane, .i-role-aside');

if (!entityContent || !mainPane) return false;

var styleId = 'tp-okr-modal-targeted-entity-cleanup-style';
if (!doc.getElementById(styleId)) {
var style = doc.createElement('style');
style.id = styleId;
style.innerHTML = [
'html, body { margin: 0 !important; padding: 0 !important; width: 100% !important; height: 100% !important; overflow: hidden !important; background: #fff !important; }',
'.tau-app-secondary-pane, .tau-app-secondary-pane.i-role-aside, .i-role-aside, nav.i-role-views-menu, .t3-views-navigator, .t3-views-catalog, .ReactVirtualized__Grid.ReactVirtualized__List.tau-custom-scrollbar-menu { display: none !important; visibility: hidden !important; width: 0 !important; min-width: 0 !important; max-width: 0 !important; }',
'.i-main.tau-app-main-pane, .tau-app-main-pane, [role="main"] { left: 0 !important; margin-left: 0 !important; width: 100% !important; max-width: none !important; height: 100vh !important; overflow: auto !important; position: relative !important; }',
'.tau-app.tau-page-single.tau-page-entity, .tau-page-single.tau-page-entity, .i-role-entity-view-container { display: block !important; visibility: visible !important; opacity: 1 !important; width: 100% !important; max-width: none !important; height: 100vh !important; min-height: 100vh !important; overflow: auto !important; }',
'.layout-container { height: auto !important; min-height: 100vh !important; max-height: none !important; overflow: visible !important; padding-bottom: 120px !important; }',
'.grid { min-height: 100vh !important; max-height: none !important; overflow: visible !important; align-items: start !important; }',
'.stack, .tabs-container { max-height: none !important; }'
].join('\n');
(doc.head || doc.documentElement).appendChild(style);
}

if (sidePane) {
sidePane.style.display = 'none';
sidePane.style.visibility = 'hidden';
sidePane.style.width = '0';
sidePane.style.minWidth = '0';
sidePane.style.maxWidth = '0';
}

mainPane.style.left = '0';
mainPane.style.marginLeft = '0';
mainPane.style.width = '100%';
mainPane.style.maxWidth = 'none';
mainPane.style.height = '100vh';
mainPane.style.overflow = 'auto';
mainPane.style.position = 'relative';

entityContent.style.display = 'block';
entityContent.style.visibility = 'visible';
entityContent.style.opacity = '1';
entityContent.style.width = '100%';
entityContent.style.maxWidth = 'none';
entityContent.style.height = '100vh';
entityContent.style.minHeight = '100vh';
entityContent.style.overflow = 'auto';

if (!doc.__tpOkrModalWheelFixAttached) {
doc.__tpOkrModalWheelFixAttached = true;
doc.addEventListener('wheel', function (event) {
var scrollTargets = [
mainPane,
entityContent,
doc.querySelector('.layout-container'),
doc.scrollingElement,
doc.documentElement,
doc.body
].filter(Boolean);

for (var i = 0; i < scrollTargets.length; i++) {
var target = scrollTargets[i];
if (target.scrollHeight > target.clientHeight + 2) {
target.scrollTop += event.deltaY;
event.preventDefault();
return;
}
}
}, { passive: false });
}

return true;
} catch (err) {
return false;
}
};

$iframe.on('load', function () {
$loading.hide();
var attempts = 0;
var cleanupTimer = setInterval(function () {
attempts++;
var cleaned = injectTargetedEntityCleanup();
if (cleaned || attempts >= 40) clearInterval(cleanupTimer);
}, 300);
});

$frameWrap.append($loading);
$frameWrap.append($iframe);
$modal.append($header);
$modal.append($frameWrap);
$overlay.append($modal);
$('body').append($overlay);

$overlay.on('click', function (e) {
if (e.target === $overlay[0]) {
$overlay.remove();
}
});

$(document).off('keydown.tpOkrModal').on('keydown.tpOkrModal', function (e) {
if (e.key === 'Escape') {
$('.tp-okr-modal-overlay').remove();
$(document).off('keydown.tpOkrModal');
}
});
};
// === END INTERACTIVITY HELPER ===

var renderGrid = function(objectives) {

var $container = $(props.placeholder).empty();

var $widget = $('<div>').css({
padding: '20px',
background: 'white',
'border-radius': '8px'
});


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

// === INTERACTIVITY: Tactical Objective card hover/click ===
$card.css({
cursor: 'pointer',
transition: 'all 0.15s ease'
});

$card.attr('title', 'Click to open Tactical Objective');

$card.hover(
function () {
$(this).css({
transform: 'translateY(-2px)',
'box-shadow': '0 6px 16px rgba(0,0,0,0.1)'
});
},
function () {
$(this).css({
transform: 'none',
'box-shadow': 'none'
});
}
);

$card.on('click', function () {
openEntityModal('tacticalobjective', obj.id, obj.name);
});
// === END INTERACTIVITY ===

$card.append(
$('<div>').text(obj.name).css({
'font-weight': '600'
})
);

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

var render = function() {

$.ajax({
url: '/api/v1/TacticalObjectives?include=[Name,Progress]&format=json',
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
id: obj.Id,
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


// ===========================================
// Tactical OKR Summary Widget (UNCHANGED WORKING VERSION)
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

id: 'tactical_objectives_grid_krs',
name: 'Tactical OKR Summary',
previewSrc: 'https://raw.githubusercontent.com/Bret-ATP/atp_spm_widgets/37891ae2093ff8d61637ded01e2872294e3c990a/img/so_status_summary_kr_preview.png',
description: 'Tactical Objectives with Key Results',
tags: ['OKR', 'Tactical Objectives'],
placeholder: 'restui_board',

insert: function (placeholder, settings) {

var props = {
placeholder: placeholder,
settings: settings || {}
};

// === INTERACTIVITY HELPER: open entity in dashboard modal iframe ===
var openEntityModal = function (entityPage, entityId, entityTitle) {
if (!entityId) return;

$('.tp-okr-modal-overlay').remove();

var hash = window.location.hash || '';
var appConfigMatch = hash.match(/(?:#|&)appConfig=([^&]+)/);
var appConfigPart = appConfigMatch ? '&appConfig=' + appConfigMatch[1] : '';

var baseUrl = window.location.origin + window.location.pathname + window.location.search;
var iframeUrl = baseUrl + '#page=' + entityPage + '/' + entityId + appConfigPart;

var $overlay = $('<div>').addClass('tp-okr-modal-overlay').css({
position: 'fixed',
top: 0,
left: 0,
right: 0,
bottom: 0,
background: 'rgba(17, 24, 39, 0.55)',
'z-index': 999999,
display: 'flex',
'justify-content': 'center',
'align-items': 'center'
});

var $modal = $('<div>').css({
width: '92vw',
height: '92vh',
background: '#ffffff',
'border-radius': '12px',
'box-shadow': '0 24px 80px rgba(0,0,0,0.35)',
display: 'flex',
'flex-direction': 'column',
overflow: 'hidden'
});

var $header = $('<div>').css({
display: 'flex',
'align-items': 'center',
'justify-content': 'space-between',
padding: '12px 16px',
background: '#f9fafb',
border: '1px solid #e5e7eb',
'border-left': 'none',
'border-right': 'none',
'border-top': 'none',
'flex': '0 0 auto'
});

$header.append(
$('<div>').text(entityTitle || ('Entity #' + entityId)).css({
'font-weight': '600',
color: '#111827',
'font-size': '14px',
'white-space': 'nowrap',
overflow: 'hidden',
'text-overflow': 'ellipsis',
'padding-right': '16px'
})
);

var $close = $('<button>').text('Close').css({
background: '#111827',
color: '#ffffff',
border: 'none',
'border-radius': '8px',
padding: '6px 12px',
cursor: 'pointer',
'font-size': '12px',
'font-weight': '600'
});

$close.on('click', function () {
$overlay.remove();
});

$header.append($close);

var $frameWrap = $('<div>').css({
position: 'relative',
flex: '1 1 auto',
'min-height': 0,
background: '#ffffff',
overflow: 'hidden'
});

var $loading = $('<div>').text('Loading details...').css({
position: 'absolute',
top: '12px',
left: '16px',
color: '#6b7280',
'font-size': '13px',
'z-index': 1
});

var $iframe = $('<iframe>').attr({
src: iframeUrl
}).css({
position: 'absolute',
top: 0,
left: 0,
width: '100%',
height: '100%',
border: '0',
background: '#ffffff'
});

var injectTargetedEntityCleanup = function () {
try {
var iframe = $iframe[0];
var doc = iframe.contentDocument || iframe.contentWindow.document;
if (!doc || !doc.body) return false;

var entityContent = doc.querySelector('.tau-app.tau-page-single.tau-page-entity.i-role-entity-view-container, .tau-page-single.tau-page-entity, .tau-page-entity');
var mainPane = doc.querySelector('.i-main.tau-app-main-pane, .tau-app-main-pane, [role="main"]');
var sidePane = doc.querySelector('.tau-app-secondary-pane.i-role-aside, .tau-app-secondary-pane, .i-role-aside');

if (!entityContent || !mainPane) return false;

var styleId = 'tp-okr-modal-targeted-entity-cleanup-style';
if (!doc.getElementById(styleId)) {
var style = doc.createElement('style');
style.id = styleId;
style.innerHTML = [
'html, body { margin: 0 !important; padding: 0 !important; width: 100% !important; height: 100% !important; overflow: hidden !important; background: #fff !important; }',
'.tau-app-secondary-pane, .tau-app-secondary-pane.i-role-aside, .i-role-aside, nav.i-role-views-menu, .t3-views-navigator, .t3-views-catalog, .ReactVirtualized__Grid.ReactVirtualized__List.tau-custom-scrollbar-menu { display: none !important; visibility: hidden !important; width: 0 !important; min-width: 0 !important; max-width: 0 !important; }',
'.i-main.tau-app-main-pane, .tau-app-main-pane, [role="main"] { left: 0 !important; margin-left: 0 !important; width: 100% !important; max-width: none !important; height: 100vh !important; overflow: auto !important; position: relative !important; }',
'.tau-app.tau-page-single.tau-page-entity, .tau-page-single.tau-page-entity, .i-role-entity-view-container { display: block !important; visibility: visible !important; opacity: 1 !important; width: 100% !important; max-width: none !important; height: 100vh !important; min-height: 100vh !important; overflow: auto !important; }',
'.layout-container { height: auto !important; min-height: 100vh !important; max-height: none !important; overflow: visible !important; padding-bottom: 120px !important; }',
'.grid { min-height: 100vh !important; max-height: none !important; overflow: visible !important; align-items: start !important; }',
'.stack, .tabs-container { max-height: none !important; }'
].join('\n');
(doc.head || doc.documentElement).appendChild(style);
}

if (sidePane) {
sidePane.style.display = 'none';
sidePane.style.visibility = 'hidden';
sidePane.style.width = '0';
sidePane.style.minWidth = '0';
sidePane.style.maxWidth = '0';
}

mainPane.style.left = '0';
mainPane.style.marginLeft = '0';
mainPane.style.width = '100%';
mainPane.style.maxWidth = 'none';
mainPane.style.height = '100vh';
mainPane.style.overflow = 'auto';
mainPane.style.position = 'relative';

entityContent.style.display = 'block';
entityContent.style.visibility = 'visible';
entityContent.style.opacity = '1';
entityContent.style.width = '100%';
entityContent.style.maxWidth = 'none';
entityContent.style.height = '100vh';
entityContent.style.minHeight = '100vh';
entityContent.style.overflow = 'auto';

if (!doc.__tpOkrModalWheelFixAttached) {
doc.__tpOkrModalWheelFixAttached = true;
doc.addEventListener('wheel', function (event) {
var scrollTargets = [
mainPane,
entityContent,
doc.querySelector('.layout-container'),
doc.scrollingElement,
doc.documentElement,
doc.body
].filter(Boolean);

for (var i = 0; i < scrollTargets.length; i++) {
var target = scrollTargets[i];
if (target.scrollHeight > target.clientHeight + 2) {
target.scrollTop += event.deltaY;
event.preventDefault();
return;
}
}
}, { passive: false });
}

return true;
} catch (err) {
return false;
}
};

$iframe.on('load', function () {
$loading.hide();
var attempts = 0;
var cleanupTimer = setInterval(function () {
attempts++;
var cleaned = injectTargetedEntityCleanup();
if (cleaned || attempts >= 40) clearInterval(cleanupTimer);
}, 300);
});

$frameWrap.append($loading);
$frameWrap.append($iframe);
$modal.append($header);
$modal.append($frameWrap);
$overlay.append($modal);
$('body').append($overlay);

$overlay.on('click', function (e) {
if (e.target === $overlay[0]) {
$overlay.remove();
}
});

$(document).off('keydown.tpOkrModal').on('keydown.tpOkrModal', function (e) {
if (e.key === 'Escape') {
$('.tp-okr-modal-overlay').remove();
$(document).off('keydown.tpOkrModal');
}
});
};
// === END INTERACTIVITY HELPER ===

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

var getStatusFromProgress = function (pct) {
if (pct >= 70) return { status: 'On Track', color: '#22c55e' };
else if (pct >= 40) return { status: 'At Risk', color: '#f59e0b' };
else return { status: 'Critical', color: '#ef4444' };
};

var render = function () {

$.ajax({
url: '/api/v1/TacticalObjectives?include=[Id,Name,Progress,CustomFields]&format=json',
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

// === INTERACTIVITY: Tactical Objective card hover/click ===
$card.css({
cursor: 'pointer',
transition: 'all 0.15s ease'
});

$card.attr('title', 'Click to open Tactical Objective');

$card.hover(
function () {
$(this).css({
transform: 'translateY(-2px)',
'box-shadow': '0 6px 16px rgba(0,0,0,0.1)'
});
},
function () {
$(this).css({
transform: 'none',
'box-shadow': 'none'
});
}
);

$card.on('click', function () {
openEntityModal('tacticalobjective', obj.Id, obj.Name);
});
// === END INTERACTIVITY ===

$card.append($('<div>').text(obj.Name).css({
'font-weight': '600',
'margin-bottom': '10px'
}));

var $row = $('<div>').css({
display: 'flex',
'justify-content': 'space-between',
'margin-bottom': '8px'
});

$row.append($('<div>').text(soStatus.status).css({
background: soStatus.color,
color: 'white',
padding: '4px 10px',
'border-radius': '10px',
'font-size': '12px'
}));

$row.append($('<div>').text(progress + '%').css({
color: soStatus.color,
'font-weight': 'bold'
}));

$card.append($row);

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

// ✅ FULL KR BLOCK RESTORED
$.ajax({
url: '/api/v1/TacticalObjectives/' + obj.Id + '/KeyResults?include=[Id,Name,Progress,CustomFields]&format=json',
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

// === INTERACTIVITY: Key Result hover/click ===
$kr.css({
cursor: 'pointer'
});

$kr.attr('title', 'Click to open Key Result');

$kr.on('click', function (e) {
e.stopPropagation();
openEntityModal('keyresult', kr.Id, kr.Name);
});

$kr.hover(
function () {
$(this).css({
background: '#f3f4f6',
'border-radius': '6px'
});
},
function () {
$(this).css({
background: 'transparent'
});
}
);
// === END INTERACTIVITY ===

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

$nameBlock.append($('<div>').text(kr.Name));

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

});
};

render();

return { update: render };
}
});
}
});
});
