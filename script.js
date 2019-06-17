var js_tree_data = [
    {
        "id": "1",
        "parent": "#",
        "text": "node_1",
        "data": {}
    },
    {
        "id": "2",
        "parent": "1",
        "text": "node_1_1",
        "data": {}
    },
    {
        "id": "3",
        "parent": "2",
        "text": "node_1_1_1",
        "data": {}
    },
    {
        "id": "4",
        "parent": "1",
        "text": "node_1_2",
        "data": {}
    },
    {
        "id": "5",
        "parent": "1",
        "text": "node_1_3",
        "data": {}
    },
    {
        "id": "6",
        "parent": "#",
        "text": "node_2",
        "data": {}
    },
    {
        "id": "7",
        "parent": "6",
        "text": "node_2_1",
        "data": {}
    },
    {
        "id": "8",
        "parent": "6",
        "text": "node_2_2",
        "data": {}
    },
    {
        "id": "9",
        "parent": "6",
        "text": "node_2_3",
        "data": {}
    }
];



$(function () {

    /* ======================================================================
       jsTree
       ====================================================================== */

    (function () {
        var $js_tree = $("#jstree");

        // Initializing jsTree
        $js_tree.jstree({
            "core" : {
                "data" : js_tree_data,
                 "check_callback" : true
            },

            "plugins" : [
                //"checkbox",
                "contextmenu",
                "dnd",
            ],

            contextmenu: {
                items: {
                    "create" : {
                        "label"             : "Создать",
                        "action"            : function() {
                            jsTreeCreate();
                        },
                    },
                    "rename" : {
                        "label"             : "Переименовать",
                        "action"            : function() {
                            jsTreeRename();
                        },
                    },
                    "remove" : {
                        "label"             : "Удалить",
                        "action"            : function() {
                            jsTreeDelete();
                        },
                    },
                },
            },
        });



        // Binding callbacks for the control buttons
        $("#js_tree_create_button").on("click", function() {
            jsTreeCreate();
        });

        $("#js_tree_rename_button").on("click", function() {
            jsTreeRename();
        });

        $("#js_tree_delete_button").on("click", function() {
            jsTreeDelete();
        });

        $("#js_tree_save_button").on("click", function() {
            jsTreeSave();
        });



        // Control functions
        function jsTreeCreate() {
            var ref = $js_tree.jstree(true),
                sel = ref.get_selected();
            sel = sel[0] || "#";
            sel = ref.create_node(sel);
            if (sel) {
                ref.edit(sel);
            }
        }

        function jsTreeRename() {
            var ref = $js_tree.jstree(true),
                sel = ref.get_selected();
            if (!sel.length) { return false; }
            sel = sel[0];
            ref.edit(sel);
        }

        function jsTreeDelete() {
            var ref = $js_tree.jstree(true),
                sel = ref.get_selected();
            if (!sel.length) { return false; }
            ref.delete_node(sel);
        }

        function jsTreeSave() {
            var js_tree = $js_tree.jstree(true).get_json(null, {
                flat: true,
            });

            var result = {
                "Create": [],
                "Update": [],
                "Delete": [],
            }

            var old_tree = js_tree_data;

            // Prepairing tree for compare
            var new_tree = [];
            for (var i = 0; i < js_tree.length; i++) {
               new_tree.push({
                  "id": js_tree[i].id,
                  "parent": js_tree[i].parent,
                  "text": js_tree[i].text,
                  "data": js_tree[i].data,
               });
            }

            // Looking for updated and created elements
            var is_item_new;
            for (var i = 0; i < new_tree.length; i++) {
                is_item_new = true;

                for (var j = 0; j < old_tree.length; j++) {
                    if (new_tree[i].id == old_tree[j].id) {
                        is_item_new = false;

                        if (JSON.stringify(new_tree[i]) != JSON.stringify(old_tree[j])) {
                            result["Update"].push(new_tree[i]);
                            break;
                        }
                    }
                }

                if (is_item_new) {
                    result["Create"].push(new_tree[i]);
                    result["Create"][result["Create"].length - 1].id = "-1";
                }
            }

            // Looking for deleted elements
            var is_item_deleted;
            for (var i = 0; i < old_tree.length; i++) {
                is_item_deleted = true;

                for (var j = 0; j < new_tree.length; j++) {
                    if (old_tree[i].id == new_tree[j].id) {
                        is_item_deleted = false;
                        break;
                    }
                }

                if (is_item_deleted) {
                    result["Delete"].push(old_tree[i].id * 1); // Convert id to int
                }
            }



            $("#js_tree_save_result")
                .text(JSON.stringify(result, null, 4))
                .removeClass("hidden");
        }
    })();

});
