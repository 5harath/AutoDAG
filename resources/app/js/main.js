"use strict";

const remote = require('electron').remote;
const app = remote.app;
var homePath = app.getPath('home');
document.getElementById("inputAirPath").placeholder = homePath + '/airflow/dags';
document.getElementById("inputPath").placeholder = homePath;

function IterarCamposEdit(t, n) {
    function i(t) {
        if (null == colsEdi) return !0;
        for (var n = 0; n < colsEdi.length; n++)
            if (t == colsEdi[n]) return !0;
        return !1
    }
    var o = 0;
    t.each(function() {
        o++, "buttons" != $(this).attr("name") && i(o - 1) && n($(this))
    })
}

function FijModoNormal(t) {
    $(t).parent().find("#bAcep").hide(),
    $(t).parent().find("#bCanc").hide(),
    $(t).parent().find("#bEdit").show(),
    $(t).parent().find("#bElim").show(),
    $(t).parents("tr").attr("id", "")
}

function FijModoEdit(t) {
    $(t).parent().find("#bAcep").show(),
    $(t).parent().find("#bCanc").show(),
    $(t).parent().find("#bEdit").hide(),
    $(t).parent().find("#bElim").hide(),
    $(t).parents("tr").attr("id", "editing")
}

function ModoEdicion(t) {
    return "editing" == t.attr("id")
}

function rowAcep(t) {
    var n = $(t).parents("tr"),
        i = n.find("td").not(":last"),
        j = n.find("td#2");
    ModoEdicion(n) && (IterarCamposEdit(i, function(t) {
        var n = t.find("input").val().replace(/, /g, ",");
        t.html(n.replace(/,/g, ", "))
    }), FijModoNormal(t), params.onEdit(n)) || (IterarCamposEdit(j, function(t) {
        var n = t.find("input").prop('checked');
        t.html(n)
    }), FijModoNormal(t), params.onEdit(n))
}

function rowCancel(t) {
    var n = $(t).parents("tr"),
        i = n.find("td");
    ModoEdicion(n) && (IterarCamposEdit(i, function(t) {
        var n = t.find("div").html();
        t.html(n)
    }), FijModoNormal(t))
}

function rowEdit(t) {
    var n = $(t).parents("tr"),
        j = n.find("td#2"),
        i = n.find("td").not(":last");
    ModoEdicion(n) || (IterarCamposEdit(i, function(t) {
        var n = t.html(),
            i = '<div style="display: none;">' + n + "</div>",
            o = '<input class="form-control input-sm" placeholder="Add task here" value="' + n + '">';
        t.html(i + o)
    }), FijModoEdit(t)),(IterarCamposEdit(j, function(t) {
        var n = t.html(),
            j = '<div style="display: none;">' + n + "</div>",
            o = '<input type="checkbox" class="form-check-input" value=' + n + ' checked=' + n + '>';
        t.html(j + o)
    }), FijModoEdit(t))
}

function rowElim(t) {
    $(t).parents("tr").remove(), params.onDelete()
}

function rowAgreg() {
    if (0 == $tab_en_edic.find("tbody tr").length) {
        var t = "";
        var iter = 0;
        (i = $tab_en_edic.find("thead tr").find("th")).each(function() {
            "buttons" == $(this).attr("name") ? t += colEdicHtml : t += "<td id="+(iter++)+"></td>"
        }), $tab_en_edic.find("tbody").append("<tr>" + t + "</tr>")
    } else {
        var n = $tab_en_edic.find("tr:last");
        jQuery("tr:last").find('#bAcep').click();
        n.clone().appendTo(n.parent());
        var i = (n = $tab_en_edic.find("tr:last")).find("td");
        i.each(function() {
            "buttons" == $(this).attr("name") || $(this).html("")
        })
    }
}

function TableToCSV(t) {
    var n = "",
        i = "";
    return $tab_en_edic.find("tbody tr").each(function() {
        ModoEdicion($(this)) && $(this).find("#bAcep").click();
        var o = $(this).find("td");
        n = "", o.each(function() {
            "buttons" == $(this).attr("name") || (n = n + $(this).html() + t)
        }), "" != n && (n = n.substr(0, n.length - t.length)), i = i + n + "\n"
    }), i
}
var $tab_en_edic = null,
    params = null,
    colsEdi = null,
    newColHtml = `<div class="btn-group pull-right">
        <button id="bEdit" type="button" class="btn btn-sm btn-primary" onclick="rowEdit(this);">
            <span class="glyphicon glyphicon-pencil" >
            </span>
        </button>
        <button id="bElim" type="button" class="btn btn-sm btn-danger" onclick="rowElim(this);">
            <span class="glyphicon glyphicon-trash" >
            </span>
        </button>
        <button id="bAcep" type="button" class="btn btn-sm btn-success" style="display:none;" onclick="rowAcep(this);">
            <span class="glyphicon glyphicon-ok" >
            </span>
        </button>
        <button id="bCanc" type="button" class="btn btn-sm btn-danger" style="display:none;" onclick="rowCancel(this);">
            <span class="glyphicon glyphicon-remove" >
            </span>
        </button>
    </div>`,
    colEdicHtml = '<div><th name="buttons" style="width: 5.5em;">' + newColHtml + "</th></div>";
$.fn.SetEditable = function(t) {
    var n = {
        columnsEd: null,
        $addButton: null,
        onEdit: function() {},
        onDelete: function() {},
        onAdd: function() {}
    };
    params = $.extend(n, t), this.find("thead tr").append('<th name="buttons"></th>'), this.find("tbody tr").append(colEdicHtml), $tab_en_edic = this, null != params.$addButton && params.$addButton.click(function() {
        rowAgreg()
    }), null != params.columnsEd && (colsEdi = params.columnsEd.split(","))
};

function saveDAGFile()
{
    jQuery("tr").find('#bAcep').click();
    var $table = $('#dvData>table');
    var $rows = $table.find('tr:has(td)'),

      // Temporary delimiter characters unlikely to be typed by keyboard
      // This is to avoid accidentally splitting the actual contents
      tmpColDelim = String.fromCharCode(11), // vertical tab character
      tmpRowDelim = String.fromCharCode(0), // null character

      // actual delimiter characters for CSV format

      colDelim = '","',
      rowDelim = '"],["',
      // Grab text from table into CSV formatted string
      graph_list = '[["' + $rows.map(function(i, row) {
        var $row = $(row),
          $cols = $row.find('td');
        return $cols.map(function(j, col) {
          var $col = $(col),
            text = $col.text();

          return text.replace(/"/g, '""'); // escape double quotes

        }).get().join(tmpColDelim);

      }).get().join(tmpRowDelim)
      .split(tmpRowDelim).join(rowDelim)
      .split(tmpColDelim).join(colDelim) + '"]]';

    graph_list = graph_list.replace(',[\"\",\"\",\"true\"]','');
    graph_list = graph_list.replace('[\"\",\"\",\"true\"]','');
    graph_list = graph_list.replace(',[\"\",\"\",\"\"]','');
    graph_list = graph_list.replace('[\"\",\"\",\"\"]','');

    var textPathSet = document.getElementById("inputPath").value;
    var textPath = document.getElementById("inputAirPath").value;
    var textFail = document.getElementById("inputFailEmail").value;
    var textDAGName = document.getElementById("inputDAGName").value;

    if(textDAGName=="" || textDAGName==null){
        textDAGName="untitled_auto_dag";
    }

    if(textPath=="" || textPath==null){
        textPath = homePath + '/airflow/dags';
    }

    if(textPathSet=="" || textPathSet==null){
        textPathSet = homePath;
    }

    var before = "import configparser\n"
    before = before.concat("import datetime as dt","\n");
    before = before.concat("import ast","\n");
    before = before.concat("import os","\n");
    before = before.concat("import ntpath","\n");
    before = before.concat("import pandas as pd","\n\n");
    before = before.concat("from airflow import DAG","\n");
    before = before.concat("from airflow.operators.bash_operator import BashOperator","\n");
    before = before.concat("from airflow.operators.email_operator import EmailOperator","\n");
    before = before.concat("from datetime import datetime, timedelta","\n");
    before = before.concat("# Setup path for setting file","\n");
    before = before.concat("in_setting = '",textPath);
    var after = "/setting.txt'\n";

    textPathSet = '\\ndir_path = '.concat(textPathSet);
    var emailSend = '';
    var i,j;
    for (i = 0; document.getElementById('emailto'+i) != null && document.getElementById('emailto'+i).value.length > 0 ; i++) {
        var emailTaskId = document.getElementById('emailtaskid'+i).value;
        var emailTo = document.getElementById('emailto'+i).value;
        emailTo = '\\nto = '.concat(emailTo);
        var emailSubject = document.getElementById('emailsubject'+i).value;
        emailSubject = '\\nsubject = '.concat(emailSubject);
        var emailContent = document.getElementById('emailcontent'+i).value;
        emailContent = emailContent.replace(/\n/g, "<br />");
        emailContent = '\\ncontent = '.concat(emailContent);
        var emailFiles = '\\nfiles = [';
        for (j = 0; document.getElementById('att'+i+'-'+j) != null && document.getElementById('att'+i+'-'+j).value.length > 0 ; j++) {
            emailFiles = emailFiles + '\''+document.getElementById('att'+i+'-'+j).files[0].path+'\'';
            if(document.getElementById('att'+i+'-'+(j+1)) != null){
                emailFiles = emailFiles + ',';
            }
        }
        emailFiles = emailFiles + ']';
        emailSend = emailSend.concat("\\n["+emailTaskId+"]\\ntype = email",emailTo,emailSubject,emailContent,emailFiles);
    }

    var textSaveAs = '[Configuration]'.concat(textPathSet,emailSend);
    after = after.concat("setting_content =\"",textSaveAs,"\"\n");
    after = after.concat("f = open(in_setting, 'w')","\n");
    after = after.concat("f.write(setting_content)","\n");
    after = after.concat("f.close()","\n");
    after = after.concat("","\n");
    after = after.concat("# Initializing configparser","\n");
    after = after.concat("config = configparser.ConfigParser()","\n");
    after = after.concat("","\n");
    after = after.concat("# Opening the configuration file through the parser","\n");
    after = after.concat("config.read(in_setting)","\n");
    after = after.concat("","\n");
    after = after.concat("list_graph = ",graph_list,"\n");
    after = after.concat("path = config.get('Configuration', 'dir_path') if config.has_option('Configuration', 'dir_path') else ''","\n");
    after = after.concat("","\n");
    after = after.concat("# Opening the CSV file of the graph","\n");
    after = after.concat("graph = pd.DataFrame(list_graph, columns=None)","\n");
    after = after.concat("# Transposing the dataframe","\n");
    after = after.concat("graph = graph.transpose()","\n");
    after = after.concat("","\n");
    after = after.concat("dags = {}","\n");
    after = after.concat("dags_mail = {}","\n");
    after = after.concat("","\n");
    after = after.concat("for i in graph:","\n");
    after = after.concat("    # Removing space from the string","\n");
    after = after.concat("    graph[i][1] = str(graph[i][1]).replace(' ', '')","\n");
    after = after.concat("    # Removing all the child tasks and adding them to the parent list","\n");
    after = after.concat("    dags[graph[i][0]] = list() if graph[i][1]=='' in graph[i][1] else list(graph[i][1].split(',')) if ',' in graph[i][1] else list([graph[i][1]])","\n");
    after = after.concat("    dags_mail[graph[i][0]] = graph[i][2]","\n");
    after = after.concat("","\n");
    after = after.concat("dags_mail = {i:dags_mail[i] for i in dags_mail if dags_mail[i]==\"true\"}","\n");
    after = after.concat("","\n");
    after = after.concat("default_args = {","\n");
    after = after.concat("    'owner': 'airflow',","\n");
    after = after.concat("    'start_date': datetime.utcnow(),","\n");
    after = after.concat("    'concurrency': 1,","\n");
    after = after.concat("    'retries': 0","\n");
    after = after.concat("}","\n");
    after = after.concat("","\n");
    after = after.concat("idag={}","\n");
    after = after.concat("","\n");
    after = after.concat("with DAG('",textDAGName,"',\n");
    after = after.concat("         catchup=False,","\n");
    after = after.concat("         default_args=default_args,","\n");
    after = after.concat("         schedule_interval='*/10 * * * *',","\n");
    after = after.concat("         ) as dag:","\n");
    after = after.concat("","\n");
    after = after.concat("    new_dags = dags.copy()","\n");
    after = after.concat("","\n");
    after = after.concat("    # Removing child tasks from each parent task","\n");
    after = after.concat("    for parent in dags:","\n");
    after = after.concat("        dags[parent] = list(set(dags[parent]))","\n");
    after = after.concat("","\n");
    after = after.concat("    # Adding absent DAGs to the dictionary","\n");
    after = after.concat("    for parent in new_dags:","\n");
    after = after.concat("        for child in new_dags[parent]:","\n");
    after = after.concat("            if child not in dags:","\n");
    after = after.concat("                dags.update({child: []})","\n");
    after = after.concat("","\n");
    after = after.concat("    for it_dag in dags:","\n");
    after = after.concat("        if(config.has_section(it_dag)):","\n");
    after = after.concat("            op_type = config.get(it_dag, 'type')","\n");
    after = after.concat("            # Handling different types of tasks with configuration","\n");
    after = after.concat("","\n");
    after = after.concat("            if op_type.lower() == 'email':","\n");
    after = after.concat("                email_to = config.get(it_dag, 'to')","\n");
    after = after.concat("                email_subject = config.get(it_dag, 'subject')","\n");
    after = after.concat("                email_content = config.get(it_dag, 'content')","\n");
    after = after.concat("                email_files_in = config.get(it_dag, 'files')","\n");
    after = after.concat("                email_files = ast.literal_eval(email_files_in)","\n");
    after = after.concat("                idag[it_dag] = EmailOperator(","\n");
    after = after.concat("                    task_id=it_dag,","\n");
    after = after.concat("                    to=email_to,","\n");
    after = after.concat("                    subject=email_subject,","\n");
    after = after.concat("                    html_content=email_content,","\n");
    after = after.concat("                    files=email_files,","\n");
    after = after.concat("                    dag=dag)","\n");
    after = after.concat("","\n");
    after = after.concat("    if(config.has_option('Configuration', 'dir_path')):","\n");
    after = after.concat("        # Parsing recursively through all the python files in the directory path given","\n");
    after = after.concat("        result = [os.path.join(dp, f) for dp, dn, filenames in os.walk(path) for f in filenames if","\n");
    after = after.concat("            os.path.splitext(f)[1] == '.py']","\n");
    after = after.concat("        result_shell = [os.path.join(dp, f) for dp