// ═══════════════════════════════════════════════════════════════
// AI Operating System — Lead Capture, Tagging & Email Delivery
// ═══════════════════════════════════════════════════════════════

var SHEET_ID      = '11e6rtm2-u8UG1ipaZm_Ms5_IG2lFxKxUQrUQ6LHG6Us';
var PDF_DRIVE_ID  = '14UlCH1wPHhuhfC1aHP6KR4IPoPPWOdF4';
var SENDER_NAME   = 'Simply Staffed AI';
var NOTIFY_EMAIL  = 'angelika.simplystaffed@gmail.com'; // gets notified on unsubscribe
var EMAIL_SUBJECT = 'Your Free AI Operating System Playbook';

// ═══════════════════════════════════════════════════════════════
// doPost — handles form submissions
// ═══════════════════════════════════════════════════════════════
function doPost(e) {
  try {
    var name  = e.parameter.name  || '';
    var email = e.parameter.email || '';
    var phone = e.parameter.phone || '';
    var role  = e.parameter.role  || '';
    var c1    = e.parameter.c1    || 'NO';
    var c2    = e.parameter.c2    || 'NO';

    // Build tags
    var tags = [];
    if (c1 === 'YES') { tags.push('Playbook_Reminders_Consent'); }
    if (c2 === 'YES') { tags.push('Marketing_Consent_AI_Tips'); }
    var tagString = tags.length > 0 ? tags.join(', ') : 'None';

    // Save to Sheet
    var ss    = SpreadsheetApp.openById(SHEET_ID);
    var sheet = ss.getSheets()[0];

    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Timestamp', 'First Name', 'Email', 'Mobile',
        'Role', 'Playbook_Reminders_Consent', 'Marketing_Consent_AI_Tips',
        'Tags', 'Unsubscribed'
      ]);
      sheet.getRange(1, 1, 1, 9)
        .setFontWeight('bold')
        .setBackground('#4a2a50')
        .setFontColor('#ffffff');
      sheet.setFrozenRows(1);
    }

    sheet.appendRow([
      new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' }),
      name, email, phone, role,
      c1, c2, tagString,
      'No' // Unsubscribed column — default No
    ]);

    // Build unsubscribe URL using this script's own URL
    var scriptUrl   = ScriptApp.getService().getUrl();
    var unsubUrl    = scriptUrl + '?action=unsubscribe&email=' + encodeURIComponent(email);
    var firstName   = name.split(' ')[0] || name;
    var pdfFile     = DriveApp.getFileById(PDF_DRIVE_ID);
    var pdfBlob     = pdfFile.getBlob().setName('The_AI_Operating_System_Playbook.pdf');

    var htmlBody =
      '<!DOCTYPE html><html><head><meta charset="UTF-8"/></head>' +
      '<body style="margin:0;padding:0;background:#f7f3fd;font-family:Arial,sans-serif;">' +
      '<table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f3fd;padding:32px 16px;">' +
      '<tr><td align="center">' +
      '<table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">' +

      '<tr><td style="background:#4a2a50;border-radius:12px 12px 0 0;padding:32px 36px 24px;text-align:center;">' +
      '<p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#e8c153;">SIMPLY STAFFED AI</p>' +
      '<h1 style="margin:0 0 6px;font-size:22px;font-weight:700;color:#ffffff;">The AI Operating System</h1>' +
      '<p style="margin:0;font-size:13px;font-style:italic;color:#e4deec;">for Property Professionals</p>' +
      '</td></tr>' +

      '<tr><td style="background:#fbf6db;border-left:1px solid #ddd4e8;border-right:1px solid #ddd4e8;padding:32px 36px 28px;">' +
      '<p style="margin:0 0 16px;font-size:16px;font-weight:600;color:#38203e;">Hey ' + firstName + ',</p>' +
      '<p style="margin:0 0 14px;font-size:14px;line-height:1.75;color:#5a3860;">' +
        'Your free playbook is attached to this email. Open it, save it, and keep it close. It is your step-by-step guide to implementing AI across your entire property business.' +
      '</p>' +
      '<p style="margin:0 0 24px;font-size:14px;line-height:1.75;color:#5a3860;">' +
        'The fastest way to get value: <strong>start with Section 2, the 3 Things to Do This Week.</strong> You\'ll save hours before next Friday.' +
      '</p>' +

      '<table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #ddd4e8;border-radius:10px;margin-bottom:24px;">' +
      '<tr><td style="padding:20px 22px;">' +
      '<p style="margin:0 0 12px;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#8a6892;">What is inside your playbook</p>' +
      '<p style="margin:4px 0;font-size:13px;color:#38203e;">&#10022;&nbsp;&nbsp;The 4-Step Deployment Plan</p>' +
      '<p style="margin:4px 0;font-size:13px;color:#38203e;">&#10022;&nbsp;&nbsp;Best Tools &amp; Workflow Examples</p>' +
      '<p style="margin:4px 0;font-size:13px;color:#38203e;">&#10022;&nbsp;&nbsp;Your Property Business Intelligence Brief (PBIB)</p>' +
      '<p style="margin:4px 0;font-size:13px;color:#38203e;">&#10022;&nbsp;&nbsp;The RCCF Prompt Framework</p>' +
      '<p style="margin:4px 0;font-size:13px;color:#38203e;">&#10022;&nbsp;&nbsp;Your 30-Day Quick-Start Checklist</p>' +
      '</td></tr></table>' +

      '<p style="margin:16px 0 0;font-size:13px;color:#8a6892;line-height:1.6;">' +
        'Questions? Simply reply to this email and we will get back to you.' +
      '</p>' +
      '</td></tr>' +

      '<tr><td style="background:#4a2a50;border-radius:0 0 12px 12px;padding:18px 36px;text-align:center;">' +
      '<p style="margin:0 0 6px;font-size:12px;color:#e4deec;">&copy; SIMPLY STAFFED AI</p>' +
      '<p style="margin:0;font-size:11px;color:#a08aac;">' +
        'You received this because you requested the free playbook.&nbsp;' +
        '<a href="' + unsubUrl + '" style="color:#e8c153;text-decoration:underline;">Unsubscribe</a>' +
      '</p>' +
      '</td></tr>' +

      '</table></td></tr></table></body></html>';

    var plainText =
      'Hey ' + firstName + ',\n\n' +
      'Your AI Operating System playbook is attached.\n\n' +
      'Start with Section 2 - the 3 Things to Do This Week.\n\n' +
      'Questions? Reply to this email.\n\n' +
      '- SIMPLY STAFFED AI\n\n' +
      'To unsubscribe: ' + unsubUrl;

    GmailApp.sendEmail(email, EMAIL_SUBJECT, plainText, {
      name:        SENDER_NAME,
      replyTo:     NOTIFY_EMAIL,
      htmlBody:    htmlBody,
      attachments: [pdfBlob]
    });

    return ContentService
      .createTextOutput('success')
      .setMimeType(ContentService.MimeType.TEXT);

  } catch (err) {
    Logger.log('ERROR: ' + err.toString());
    return ContentService
      .createTextOutput('error: ' + err.toString())
      .setMimeType(ContentService.MimeType.TEXT);
  }
}

// ═══════════════════════════════════════════════════════════════
// doGet — handles unsubscribe clicks
// ═══════════════════════════════════════════════════════════════
function doGet(e) {
  var action = e && e.parameter ? e.parameter.action : '';
  var email  = e && e.parameter ? (e.parameter.email || '') : '';

  if (action === 'unsubscribe' && email !== '') {

    // Find the row with this email and mark as Unsubscribed
    var ss    = SpreadsheetApp.openById(SHEET_ID);
    var sheet = ss.getSheets()[0];
    var data  = sheet.getDataRange().getValues();

    for (var i = 1; i < data.length; i++) {
      if (data[i][2] === email) { // Column C = Email (index 2)
        sheet.getRange(i + 1, 9).setValue('Yes'); // Column I = Unsubscribed
        break;
      }
    }

    // Notify Angelika that someone unsubscribed
    GmailApp.sendEmail(
      NOTIFY_EMAIL,
      'Unsubscribe Request: ' + email,
      email + ' has clicked unsubscribe and has been marked in the sheet.'
    );

    // Return confirmation page shown to the user
    return HtmlService.createHtmlOutput(
      '<!DOCTYPE html><html><head><meta charset="UTF-8"/>' +
      '<meta name="viewport" content="width=device-width,initial-scale=1"/>' +
      '<title>Unsubscribed</title></head>' +
      '<body style="margin:0;padding:48px 24px;background:#f7f3fd;font-family:Arial,sans-serif;text-align:center;">' +
      '<div style="max-width:480px;margin:0 auto;background:#ffffff;border-radius:16px;padding:48px 36px;box-shadow:0 8px 32px rgba(74,42,80,0.10);">' +
      '<p style="font-size:40px;margin:0 0 16px;">&#10003;</p>' +
      '<h1 style="font-size:22px;font-weight:700;color:#4a2a50;margin:0 0 12px;">You have been unsubscribed</h1>' +
      '<p style="font-size:14px;color:#8a6892;line-height:1.7;margin:0;">' +
        'Your email address <strong>' + email + '</strong> has been removed from our list.<br/>You will not receive further emails from us.' +
      '</p>' +
      '</div></body></html>'
    );
  }

  // Default response for any other GET
  return ContentService
    .createTextOutput('OK')
    .setMimeType(ContentService.MimeType.TEXT);
}
