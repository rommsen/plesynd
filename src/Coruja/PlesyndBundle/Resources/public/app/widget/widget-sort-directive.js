'use strict';

Application.Directives.directive('widgetSort', ['widgetService',
    function (widgetService) {
        return  {
            'link' : function (scope, element, attrs, ctrl) {
                //var scope = this;
                var startParent = null,
                    stopParent = null,
                    parent;
                element.sortable({
                    items : '.widget',
                    stop : function (event, ui) {
                        var widget;
                        var position = 1;
                        $(".widget").each(function(index, element){
                            console.log('element', element);
                            console.log('index', index);
                            widget = angular.element(element).scope().widget;
                            console.log('widget', widget.id, scope.isWidgetVisible(widget));
                            if(scope.isWidgetVisible(widget)) {
                                widget.position = position;
                                widgetService.put(widget);
                                position += 1;
                            }
                        });

                    }
//                        stopParent = $(ui.item).parent();
//                        console.log('stop', stopParent);
//                        stopParent.children('.widget').each(function() {
//                            console.log('kind', arguments) ;
//                        }) ;
//                        console.log(stopParent.children('.widget'));
////                        var stopData = scope.data.lists[stopParent.attr('lid')];
////                        var tasks = [];
////                        console.log(stopParent.children('.widget'));
////                        stopParent.children('.widget').each(function (index) {
////                            console.log('this', this);
////                            console.log('arguments', arguments);
////                            var liItem = scope.$eval($(this).attr('obj'));
////                            liItem.ord = index;
////                            tasks.push(liItem);
////                        });
////                        stopData.tasks = tasks;
////                        scope.$eval();
////
////                        //Post sort data read
////                        $('#data-output').empty();
////                        $.each(stopData.tasks, function (index, value) {
////                            $('#data-output').append(value['name'] + '<br />');
////                        });
//                    },
//                    connectWith : '.widgets',
//                    placeholder : 'ui-state-highlight',
//                    forcePlaceholderSize : true,
//                    dropOnEmpty : true

                });
            }

        };
    }]);