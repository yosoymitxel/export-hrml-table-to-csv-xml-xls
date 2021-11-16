function nombreArchivo(nombre) {
    return nombre+'-'+((new Date).toLocaleDateString()).replaceAll('/','-')
}

function exportHTMLTableExcel(table) {
    let filename = nombreArchivo(table)
    var downloadLink;
    var dataType    = 'application/vnd.ms-excel';
    var tableSelect = document.getElementById(table);
    var tableHTML   = tableSelect.outerHTML.replace(/ /g, '%20');
    
    // Specify file name
    filename = filename ? filename+'.xls':'excel_data.xls';
    
    // Create download link element
    downloadLink = document.createElement("a");
    
    document.body.appendChild(downloadLink);
    
    if(navigator.msSaveOrOpenBlob){
        var blob = new Blob(['ufeff', tableHTML], {
            type: dataType
        });
        navigator.msSaveOrOpenBlob( blob, filename);
    }else{
        // Create a link to the file
        downloadLink.href = 'data:' + dataType + ', ' + tableHTML;
    
        // Setting the file name
        downloadLink.download = filename;
        
        //triggering the function
        downloadLink.click();
    }
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
