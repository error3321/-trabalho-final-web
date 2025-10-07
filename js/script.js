document.addEventListener("DOMContentLoaded", () => {
  const table = document.querySelector(".kv-grid-table");
  const tbody = table.querySelector("tbody");

  // 🔹 Define colunas clicáveis e seus tipos
  const sortableColumns = {
    1: "number", // Id
    2: "text",   // Tipo
    4: "date",   // Data Abertura
    5: "text"    // Status
  };

  // 🔹 Ordenação ao clicar nos cabeçalhos
  const headers = table.querySelectorAll("th a");
  headers.forEach((headerLink) => {
    const th = headerLink.closest("th");
    const columnIndex = th.cellIndex;

    if (sortableColumns[columnIndex]) {
      th.style.cursor = "pointer";
      th.addEventListener("click", () => {
        let direction = th.getAttribute("data-direction") || "asc";
        const newDirection = direction === "asc" ? "desc" : "asc";

        // Limpa direção das outras colunas
        table.querySelectorAll("th").forEach((h) => {
          h.removeAttribute("data-direction");
          const icon = h.querySelector(".filter-icon");
          if (icon) icon.className = "filter-icon fas fa-sort-down";
        });

        // Define nova direção
        th.setAttribute("data-direction", newDirection);

        // Atualiza ícone
        const icon = th.querySelector(".filter-icon");
        if (icon) {
          icon.className =
            newDirection === "asc"
              ? "filter-icon fas fa-sort-up"
              : "filter-icon fas fa-sort-down";
        }

        // Ordena tabela
        sortTable(tbody, columnIndex, sortableColumns[columnIndex], newDirection);
      });
    }
  });

  // 🔹 Função de ordenação
  function sortTable(tbody, columnIndex, type, direction) {
    const rows = Array.from(tbody.querySelectorAll("tr"));
    rows.sort((a, b) => {
      const cellA = a.cells[columnIndex].innerText.trim();
      const cellB = b.cells[columnIndex].innerText.trim();

      let valA, valB, compare;

      switch (type) {
        case "number":
          valA = parseFloat(cellA) || 0;
          valB = parseFloat(cellB) || 0;
          compare = valA - valB;
          break;

        case "date":
          const parseDate = (str) => {
            const [datePart, timePart] = str.split(" ");
            const [day, month, year] = datePart.split("/").map(Number);
            return new Date(`20${year}-${month}-${day}T${timePart}`);
          };
          valA = parseDate(cellA);
          valB = parseDate(cellB);
          compare = valA - valB;
          break;

        default:
          compare = cellA.localeCompare(cellB, "pt-BR", { sensitivity: "base" });
      }

      return direction === "asc" ? compare : -compare;
    });

    tbody.innerHTML = "";
    rows.forEach((row) => tbody.appendChild(row));
  }

  // 🔹 FILTRO de pesquisa (inputs e selects)
  const filterInputs = table.querySelectorAll(".filters input, .filters select");

  filterInputs.forEach((input) => {
    input.addEventListener("input", filterRows);
    input.addEventListener("change", filterRows);
  });

  function filterRows() {
    const rows = tbody.querySelectorAll("tr");
    const filters = Array.from(filterInputs).map((input) => input.value.toLowerCase());

    rows.forEach((row) => {
      const cells = Array.from(row.cells);
      const match = filters.every((filterValue, index) => {
        if (!filterValue) return true;
        return cells[index].innerText.toLowerCase().includes(filterValue);
      });

      row.style.display = match ? "" : "none";
    });
  }
});
