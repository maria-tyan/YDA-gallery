$(document).ready(function () {
    /*--------------galery tabs -----------------*/
    $('.tab_block').click(function () {
        console.log(!$(this).hasClass('tab_block__active'));
        if(!$(this).hasClass('tab_block__active')){
            $(this).parent('.tab').find('.tab_block').removeClass('tab_block__active');
            $(this).addClass('tab_block__active');
            $(this).parents('.material').find('section').toggle();
        }
    })
    // /*------------yandexDiskAPI------------------------*/
    $("a.ydisk-onready-example")
    .ydisk({
        onType: 'ready', //default is click on element
    });
});