function nombreArchivo(nombre) {
    return nombre+'-'+((new Date).toLocaleDateString()).replaceAll('/','-')
}

function exportHTMLTableExcel(table) {
    let name = nombreArchivo(table)
    var uri =
        'data:application/vnd.ms-excel;base64,',
        template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
        base64 = function (s) {
            return window.btoa(unescape(encodeURIComponent(s)))
        },
        format = function (s, c) {
            return s.replace(/{(\w+)}/g, function (m, p) {
                    return c[p];
                }
            )
        }

    if (!table.nodeType) table = document.getElementById(table)

    var ctx    = {worksheet: name || 'Worksheet', table: table.innerHTML}
    var a      = document.createElement('a');
    a.href     = uri + base64(format(template, ctx))
    a.download = name + '.xls';
    //triggering the function
    a.click();
}

function exportHTMLTableCSV(idTable) {
    let filename = nombreArchivo(idTable)
    var data     = []
    var rows     = document.querySelectorAll("table tr")

    for (let i = 0, iMax = rows.length; i < iMax; i++) {
        var row = [], cols = rows[i].querySelectorAll("td, th")

        for (let j = 0, jMax = cols.length; j < jMax; j++) {
            row.push(cols[j].innerText)
        }

        data.push(row.join(";"))
    }

    let csv = data.join("\n")

    var csv_file, download_link;

    csv_file                    = new Blob([csv], {type: "text/csv"});
    download_link               = document.createElement("a");
    download_link.download      = filename;
    download_link.href          = window.URL.createObjectURL(csv_file);
    download_link.style.display = "none";

    document.body.appendChild(download_link);
    download_link.click();
}

function exportHTMLTableXML(idTable,tituloPadre=productos) {
    let nombre = nombreArchivo(idTable)
    let titulos = []
    $('#table-duplicados thead th').each(function(i,o) {
        titulos.push($(o).text())
    })

    let data   =
        `<?xml version="1.0" encoding="UTF-8"?>
 <${tituloPadre}>
        ${Array.from($(`#${idTable} tbody tr`))
            .map(
                producto => {
                    let resouesta = ''
                    let i = 0
                    resouesta += '  <producto>\n'

                    for (titulo of titulos) {
                        resouesta += `          <${titulo}>${producto.children[i].innerText}</${titulo}>\n`
                        i++
                    }

                    resouesta += '  </producto>\n'
                    return resouesta

                }
            )
            .join("")
        }
 </${tituloPadre}>`;
    const a = document.createElement("a");
    a.href  = URL.createObjectURL(new Blob([data], {
        type: "text/xml"
    }));
    a.setAttribute("download", nombre);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
