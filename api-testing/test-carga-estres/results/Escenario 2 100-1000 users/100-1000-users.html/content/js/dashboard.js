/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 66.36033146055492, "KoPercent": 33.63966853944508};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.3792770448708814, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.2020190759321194, 500, 1500, "POST Crear Producto"], "isController": false}, {"data": [0.8408152622658729, 500, 1500, "POST Crear Producto-0"], "isController": false}, {"data": [0.5013689105210551, 500, 1500, "POST Crear Producto-1"], "isController": false}, {"data": [0.6905252317198765, 500, 1500, "GET Listar Productos-0"], "isController": false}, {"data": [0.09175163897123037, 500, 1500, "GET Listar Productos"], "isController": false}, {"data": [0.3539174522696665, 500, 1500, "GET Listar Productos-1"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 329813, 110948, 33.63966853944508, 1364.1888494389593, 0, 136046, 257.0, 7795.0, 15325.0, 21864.99, 666.7293343279298, 3808.5400015831165, 101.7725582733442], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["POST Crear Producto", 80730, 42835, 53.05958132045089, 1156.095887526312, 0, 136046, 56.0, 1724.0, 8244.850000000002, 21705.99, 164.30577604103064, 1128.0135382321814, 34.203043192468556], "isController": false}, {"data": ["POST Crear Producto-0", 46022, 0, 0.0, 828.0445004563061, 173, 38809, 300.0, 1007.0, 7481.950000000001, 15908.970000000005, 95.08815210137337, 62.75508827090474, 22.564864219368875], "isController": false}, {"data": ["POST Crear Producto-1", 46022, 8127, 17.658945721611403, 1111.0890226413505, 0, 135078, 412.0, 2121.9000000000015, 7691.0, 16411.860000000022, 93.70444272508857, 905.8364532007167, 11.980467716053468], "isController": false}, {"data": ["GET Listar Productos-0", 37869, 0, 0.0, 1766.6165993292723, 184, 35069, 626.5, 7619.0, 8578.95, 21383.99, 76.69810690220176, 50.46773953854349, 9.51236286775354], "isController": false}, {"data": ["GET Listar Productos", 81301, 51709, 63.60192371557545, 1664.1504163540599, 0, 60925, 27.0, 7845.0, 15096.95, 22262.960000000006, 164.35301704358233, 963.4233968544625, 16.913688673502495], "isController": false}, {"data": ["GET Listar Productos-1", 37869, 8277, 21.85692783015131, 1720.5549658031564, 1, 56058, 715.0, 7576.0, 8858.750000000004, 21420.0, 76.68117849549458, 714.7527854326971, 7.431611952009719], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 643, 0.5795507805458413, 0.19495896159338777], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset by peer", 41, 0.03695424883729315, 0.012431286820107152], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Se produjo un error durante el intento de conexi&oacute;n ya que la parte conectada no respondi&oacute; adecuadamente tras un periodo de tiempo, o bien se produjo un error en la conexi&oacute;n establecida ya que el host conectado no ha podido responder", 148, 0.13339582507120454, 0.04487391339941118], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to fakestoreapi.com:443 [fakestoreapi.com/104.21.20.217, fakestoreapi.com/172.67.194.129] failed: Connection timed out: connect", 8, 0.0072105851389840285, 0.0024256169405087124], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to fakestoreapi.com:80 [fakestoreapi.com/104.21.20.217, fakestoreapi.com/172.67.194.129] failed: Connection timed out: connect", 2, 0.0018026462847460071, 6.064042351271781E-4], "isController": false}, {"data": ["Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 110106, 99.24108591412192, 33.38437235645654], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 329813, 110948, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 110106, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 643, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Se produjo un error durante el intento de conexi&oacute;n ya que la parte conectada no respondi&oacute; adecuadamente tras un periodo de tiempo, o bien se produjo un error en la conexi&oacute;n establecida ya que el host conectado no ha podido responder", 148, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset by peer", 41, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to fakestoreapi.com:443 [fakestoreapi.com/104.21.20.217, fakestoreapi.com/172.67.194.129] failed: Connection timed out: connect", 8], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["POST Crear Producto", 80730, 42835, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 42302, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 437, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Se produjo un error durante el intento de conexi&oacute;n ya que la parte conectada no respondi&oacute; adecuadamente tras un periodo de tiempo, o bien se produjo un error en la conexi&oacute;n establecida ya que el host conectado no ha podido responder", 67, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset by peer", 29, "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["POST Crear Producto-1", 46022, 8127, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 8016, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 75, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Se produjo un error durante el intento de conexi&oacute;n ya que la parte conectada no respondi&oacute; adecuadamente tras un periodo de tiempo, o bien se produjo un error en la conexi&oacute;n establecida ya que el host conectado no ha podido responder", 24, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset by peer", 12, "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["GET Listar Productos", 81301, 51709, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 51572, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 95, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Se produjo un error durante el intento de conexi&oacute;n ya que la parte conectada no respondi&oacute; adecuadamente tras un periodo de tiempo, o bien se produjo un error en la conexi&oacute;n establecida ya que el host conectado no ha podido responder", 36, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to fakestoreapi.com:443 [fakestoreapi.com/104.21.20.217, fakestoreapi.com/172.67.194.129] failed: Connection timed out: connect", 4, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to fakestoreapi.com:80 [fakestoreapi.com/104.21.20.217, fakestoreapi.com/172.67.194.129] failed: Connection timed out: connect", 2], "isController": false}, {"data": ["GET Listar Productos-1", 37869, 8277, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 8216, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 36, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Se produjo un error durante el intento de conexi&oacute;n ya que la parte conectada no respondi&oacute; adecuadamente tras un periodo de tiempo, o bien se produjo un error en la conexi&oacute;n establecida ya que el host conectado no ha podido responder", 21, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to fakestoreapi.com:443 [fakestoreapi.com/104.21.20.217, fakestoreapi.com/172.67.194.129] failed: Connection timed out: connect", 4, "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
