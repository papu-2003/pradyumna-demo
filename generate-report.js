const fs = require('fs');

// Read JSON report
const data = JSON.parse(fs.readFileSync('axe-report.json', 'utf-8'));

// ✅ Calculate total issues (actual vulnerabilities)
let totalIssues = 0;
let severity = { critical: 0, serious: 0, moderate: 0, minor: 0 };

data.violations.forEach(v => {
  totalIssues += v.nodes.length;

  if (severity[v.impact] !== undefined) {
    severity[v.impact] += v.nodes.length;
  }
});

// ✅ Start HTML
let html = `
<h1>Accessibility Report</h1>
<p><b>Total Rule Violations:</b> ${data.violations.length}</p>
<p><b>Total Issues Found:</b> ${totalIssues}</p>

<h2>Severity Breakdown</h2>
<ul>
  <li>Critical: ${severity.critical}</li>
  <li>Serious: ${severity.serious}</li>
  <li>Moderate: ${severity.moderate}</li>
  <li>Minor: ${severity.minor}</li>
</ul>
<hr/>
`;

// ✅ Loop through each issue
data.violations.forEach(v => {
  html += `
    <div style="border:1px solid black; margin:10px; padding:10px;">
      <h2>${v.id} (Count: ${v.nodes.length})</h2>
      <p><b>Description:</b> ${v.description}</p>
      <p><b>Impact:</b> ${v.impact}</p>
      <p><b>Fix:</b> ${v.help}</p>
      <p><b>More Info:</b> <a href="${v.helpUrl}" target="_blank">Learn More</a></p>

      <h3>Affected Elements:</h3>
      <ul>
  `;

  v.nodes.forEach(node => {
    html += `<li>${node.target}</li>`;
  });

  html += `</ul></div>`;
});

// Write HTML file
fs.writeFileSync('axe-report.html', html);

console.log("✅ Professional Accessibility Report Generated");
