var Grid = function(src) {
    var data = [];
    var callback;

    var columns = [
        {id: "date", name: "Date", field: "date", width: 100},
        {id: "CI", name: "CI", field: "CI", width: 100},
        {id: "LI", name: "LI", field: "LI", width: 100},
        {id: "LgI", name: "LgI", field: "LgI", width: 100},
        {id: "delete", name:"Delete", field:"del", width:100, formatter: CheckboxFormatter, editor: Slick.Editors.CheckboxEditor}
    ];

    var options = {
        editable: true,
        enableAddRow: false,
        enableCellNavigation: false,
        asyncEditorLoading: false,
        autoEdit: false
    };

    var i = 1;
    src.forEach(function(d) {
        data.push({id:i, date:d.date, CI:d.CI, LI:d.LI, LgI:d.LgI});
        i++;
    })

    var dataView = new Slick.Data.DataView();
    dataView.setItems(data);

    $(function() {
        grid = new Slick.Grid("#myGrid", dataView, columns, options);
        grid.setSelectionModel(new Slick.CellSelectionModel());
        grid.onClick.subscribe(function(e, args) {
            if ($(e.target).is(':checkbox') && options['editable']) {
                var column = args.grid.getColumns()[args.cell];
                if (column['editable'] == false || column['autoEdit'] == false)
                    return;
                data[args.row][column.field] = !data[args.row][column.field];
                callback()
            }
        })
    });


    this.createGridData = function(data) {
        var i = 1;
        var gridData = []
        data.forEach(function(d) {
            gridData.push({id:i, date:d.date, CI:d.CI, LI:d.LI, LgI:d.LgI});
            i++;
        });
        return gridData;
    }
    
    this.get = function() {
        return data;
    }

    function CheckboxFormatter(row, cell, value, columnDef, dataContext) {
        if (value)
            return '<input type="checkbox" name="" value="' + value + '" checked />';
        else
            return '<input type="checkbox" name="" value="' + value + '" />';
    }
    
    this.addChangeListener = function(cb) {
        callback = cb;
    }
}
