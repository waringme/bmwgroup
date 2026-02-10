export default function decorate(block) {
  // Check if first row has an image for background
  const firstRow = block.querySelector(':scope > div:first-child');
  if (!firstRow?.querySelector('picture')) {
    block.classList.add('no-image');
  }

  // Process content rows (all rows after the image row)
  const rows = [...block.children];
  rows.forEach((row) => {
    const cell = row.querySelector(':scope > div');
    if (!cell) return;

    // Skip image row
    if (cell.querySelector('picture')) return;

    const text = cell.textContent.trim();

    // Convert # heading syntax to h1 element
    const headingMatch = text.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch && cell.childNodes.length === 1 && !cell.querySelector('a')) {
      const level = headingMatch[1].length;
      const heading = document.createElement(`h${level}`);
      heading.textContent = headingMatch[2];
      cell.replaceChildren(heading);
      return;
    }

    // Convert link paragraphs to button containers
    const links = cell.querySelectorAll('a');
    if (links.length > 0) {
      const p = cell.querySelector('p') || cell;
      const hasOnlyLinks = [...p.childNodes].every((node) => {
        if (node.nodeType === Node.TEXT_NODE) return !node.textContent.trim();
        if (node.nodeType === Node.ELEMENT_NODE) {
          return node.tagName === 'A' || node.tagName === 'EM' || node.tagName === 'STRONG';
        }
        return false;
      });
      if (hasOnlyLinks) {
        p.className = 'button-container';
        [...p.querySelectorAll('a')].forEach((link) => {
          const isSecondary = link.closest('em');
          link.className = isSecondary ? 'button secondary' : 'button';
          if (isSecondary) link.closest('em').replaceWith(link);
        });
      }
    }
  });
}
