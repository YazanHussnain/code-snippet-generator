function parseLineRanges(text) {
    const set = new Set();
    if (!text) return set;
  
    text.split(',').forEach(part => {
      if (part.includes('-')) {
        const [a, b] = part.split('-').map(Number);
        for (let i = a; i <= b; i++) set.add(i);
      } else {
        set.add(Number(part));
      }
    });
  
    return set;
  }
  
  function escapeHTML(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }
  
  function highlight(line, lang) {
    // Escape HTML first
    line = escapeHTML(line);
  
    if (lang === 'c') {
      // comments
      line = line.replace(/(\/\/.*)/g, '<span class="cmt">$1</span>');
      // strings (double quotes)
      line = line.replace(/(&quot;(?:\\.|[^&])*?&quot;)/g, '<span class="str">$1</span>');
      // keywords
      line = line.replace(/\b(int|void|struct|return|if|else|for|while|const|uint64_t)\b/g, '<span class="kw">$1</span>');
      // function names
      line = line.replace(/\b([a-zA-Z_]\w*)(?=\()/g, '<span class="fn">$1</span>');
      // numbers
      line = line.replace(/\b(\d+)\b/g, '<span class="num">$1</span>');
    }
  
    if (lang === 'py') {
      // comments
      line = line.replace(/(#.*)/g, '<span class="cmt">$1</span>');
      // strings
      line = line.replace(/(&quot;(?:\\.|[^&])*?&quot;)/g, '<span class="str">$1</span>');
      // keywords
      line = line.replace(/\b(def|return|if|else|for|while|class|import|from)\b/g, '<span class="kw">$1</span>');
      // numbers
      line = line.replace(/\b(\d+)\b/g, '<span class="num">$1</span>');
    }
  
    return line;
  }
  

  document.addEventListener("DOMContentLoaded", () => {
    const editor = document.getElementById("codeInput");
    const lineNumbers = document.getElementById("lineNumbers");
  
    function updateLineNumbers() {
      const lines = editor.innerText.split("\n").length;
      let html = "";
      for (let i = 1; i <= lines; i++) {
        html += `<div>${i}</div>`;
      }
      lineNumbers.innerHTML = html;
    }
  
    editor.addEventListener("input", updateLineNumbers);
    editor.addEventListener("scroll", () => {
      lineNumbers.scrollTop = editor.scrollTop;
    });
  
    updateLineNumbers();
  
    /* Existing generator logic */
    window.generateSnippet = function () {
      const code = editor.innerText.split("\n");
      const lang = document.getElementById("language").value;
      const boldLines = parseLineRanges(
        document.getElementById("highlightLines").value
      );
  
      let html = '<table class="code-table">';
  
      code.forEach((line, i) => {
        const ln = i + 1;
        const cls = boldLines.has(ln)
          ? "code-line ref"
          : "code-line";
  
        html += `
          <tr>
            <td class="code-ln">${ln}</td>
            <td class="${cls}">${highlight(line, lang)}</td>
          </tr>`;
      });
  
      html += "</table>";
      document.getElementById("output").innerHTML = html;
    };
  });
  
  
  function generateSnippet() {
    const code = document.getElementById("codeInput").value.split("\n");
    const lang = document.getElementById("language").value;
    const boldLines = parseLineRanges(
      document.getElementById("highlightLines").value
    );
  
    let html = '<table class="code-table">';
  
    code.forEach((line, index) => {
      const lineNo = index + 1;
      const cls = boldLines.has(lineNo)
        ? 'code-line ref'
        : 'code-line';
  
      html += `
        <tr>
          <td class="code-ln">${lineNo}</td>
          <td class="${cls}">${highlight(line, lang)}</td>
        </tr>`;
    });
  
    html += '</table>';
  
    document.getElementById("output").innerHTML = html;
  }
  
  function copySnippet() {
    const el = document.getElementById("output");
    const range = document.createRange();
    range.selectNode(el);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand("copy");
  
    alert("HTML copied. Paste directly into your email.");
  }
  
