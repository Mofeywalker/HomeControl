<?php
    // debug
    $myFile = "avr-google.log";
    $fh = fopen($myFile, 'w');

    // read options provided when calling this php script
    fwrite($fh, "read options - ");
    // Handle command line arguments
    $time_scope = $_GET ['scope'];
    fwrite($fh, "scope - ");fwrite($fh, $time_scope); fwrite($fh, "\n");

    $dbhost = "127.0.0.1";
    $dbuser = "root";
    $dbpass = "1992Annaftw";
    $dbname = "avrio";

    fwrite($fh, "mysql_connect - ");
    // Mit mysql_connect() �ffnet man eine Verbindung zu einer MySQL-Datenbank.
    // Im Erfolgsfall gibt diese Funktion eine Verbindungskennung, sonst false zur�ck
    mysql_connect($dbhost, $dbuser, $dbpass) or die ('Error connecting to mysql');
    fwrite($fh, "SQL server o.k.\n");

    fwrite($fh, "mysql_select_db - ");
    // Mit mysql_select_db() w�hlt man eine Datenbank aus.
    // Im Erfolgsfall gibt diese Funktion true, sonst false zur�ck.
    mysql_select_db($dbname)or die ('Error connecting to database');
    fwrite($fh, "database o.k.\n");

    $int_y_pos = -1;
    $int_y_step_small = 1;

    // default
    $sql = "SELECT Innen, Aussen, UNIX_TIMESTAMP(dattim) AS date FROM avrdat WHERE dattim >= Date_Sub(CURRENT_TIMESTAMP(), Interval 24 HOUR) ORDER BY dattim";

    // SELECT DATE_FORMAT(dattim, '%Y-%m-%d_%T') AS date FROM avrdat

    fwrite($fh, "mysql_query - ");
    fwrite($fh, $sql); fwrite($fh, "\n");
    // Mit mysql_query() sendet man eine SQL-Anfrage (Anfrage) an einen Datenbankserver.
    // Die Funktion mysql_query() liefert im Erfolgsfall true, sonst false zur�ck.
    $sql = mysql_query($sql) or die ('Error selecting data');
    fwrite($fh, "mysql_query o.k.\n");

    fwrite($fh, "mysql_num_rows - ");
    $rownum = mysql_num_rows($sql);
    fwrite($fh, $rownum); fwrite($fh, "\n");

    fwrite($fh, "end of php - starting html\n\n");
?>


<!--Load the AJAX API-->
    <script type="text/javascript" src="https://www.google.com/jsapi"></script>
    <script type="text/javascript">

      // Load the Visualization API and the piechart package.
      google.load("visualization", "1", {packages:["corechart"]});

      // Set a callback to run when the Google Visualization API is loaded.
      google.setOnLoadCallback(drawData);

      // Callback that creates and populates a data table,
      // instantiates the pie chart, passes in the data and
      // draws it.
      function drawData() {

        // Create the data table.
        var data = new google.visualization.DataTable();
        data.addColumn('datetime', 'Datum');
        data.addColumn('number', 'Innen');
        data.addColumn('number', 'Aussen');

<?php
  echo "data.addRows($rownum);\n";
  $fh = fopen($myFile, 'a');fwrite($fh, "\n");
  while($row = mysql_fetch_assoc($sql)) {
          $int_y_pos += $int_y_step_small;
          echo "data.setValue(" . $int_y_pos . ", 0, new Date(" . $row['date']*1000 . "));\n";
          echo "data.setValue(" . $int_y_pos . ", 1," . $row['Innen'] . ");\n";
          echo "data.setValue(" . $int_y_pos . ", 2," . $row['Aussen'] . ");\n";
          fwrite($fh, $row['date'] ); fwrite($fh, " - ");
          fwrite($fh, $row['Innen']);fwrite($fh, " - ");
          fwrite($fh, "\n");
  }
?>
	var ac = new google.visualization.AreaChart(document.getElementById('visualization'));
	 ac.draw(data, {
	title : '1Wire Temperatursensoren',
	isStacked: false,
	width: 1400,
	height: 800,
	vAxis: {title: "Temperatur (Grad Celsius)",
        minorGridlines: {count: 3},
        // maxValue: 40,
        minValue: 0
        },
	hAxis: {title: "Zeit",
        minorGridlines: {count: 3},
        format: "H:mm"
        },
  legend:{position: "bottom"},
  areaOpacity: 0
	});}

</script>
