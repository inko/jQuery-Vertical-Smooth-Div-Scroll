(function ( $ ) {
    // Передача контекста
    if ( ! Function.prototype.context ) {
        Function.prototype.context = function( context /*, arg1, arg2... */ ) {
            'use strict';
            if ( typeof this !== 'function' ) {
                throw new TypeError();        
            }
            var _arguments = Array.prototype.slice.call( arguments, 1);
            var _this = this;
            var _concat = Array.prototype.concat;
            var _function = function() {
                return _this.apply(
                    ( this instanceof _dummy ) ? this : context,
                    _concat.apply( _arguments, arguments ) 
                );
            };
            var _dummy = function() {};
            _dummy.prototype = _this.prototype;
            _function.prototype = new _dummy();
            return _function;
        };
    }                      
    
    // Объект организующий прокрутку слоя
    function Scroller ( elem, options ) {
        // Слой который необходимо прокручивать
        this.scroll = $( elem ).find( '.scroll-block' )[0];
        
        // Кнопка крутить вниз
        this.down = $( elem ).find( '.scroll-down' )[0];
        
        // Кнопка крутить вверх
        this.up = $( elem ).find( '.scroll-up' )[0];
        
        // Объект хранящий функцию прокрутки 
        this.interval = null;               
        
        // Свиг прокрутки 
        this.delta = 0;
        
        // Шаг прокрутки
        this.step = options.step;
        
        // Интервал обновления   
        this.refresh = options.interval;
        
        // Прозрачность изначальная
        this.opacityInitial = options.opacityInitial;
        
        // Прозрачность при наведении мышки
        this.opacityHover = options.opacityHover;
        
        
        // Обработка событий поподания в облать кнопк вверх 
        $( this.down ).hover(
            function(){
                $( this.down ).css( 'opacity', '0.6' );
                this.scrollDown();
            }.context( this ),
        
            function(){
                $( this.down ).css( 'opacity', '0.1' );
                this.scrollStop();
            }.context( this )
        );
        
        // Обработка событий поподания в облать кнопки вверх 
        $( this.up ).hover(
            function(){                          
                $( this.up ).css( 'opacity', '0.6' );
                this.scrollUp();
            }.context( this ),
        
            function(){                              
                $( this.up ).css( 'opacity', '0.1' );
                this.scrollStop();
            }.context( this )
        );
    
    
    }
    
    // Прокрутка вверх
    Scroller.prototype.scrollUp = function () {
          this.interval = window.setInterval( function (){ 
              this.delta -= this.step;
              if( this.delta > 0 ){
                  $( this.scroll ).css( { 'margin-top' : ( this.delta * -1 ) + 'px' } );
                 } else {
                     this.scrollStop();
                 }
         }.context( this ), this.refresh );
    };
    
    // Прокрутка вниз
    Scroller.prototype.scrollDown = function () {
        this.interval = window.setInterval( function (){ 
             this.delta += this.step;
             maxdelta = ( $(this.scroll).children().length * $(this.scroll).children().first().height() ) 
                      - $(this.scroll).height();
                  
             if( this.delta <= maxdelta ) {
                 $(this.scroll).css( { 'margin-top' : ( this.delta * -1 ) + 'px' } );
             } else {
                 this.scrollStop();
             }
         }.context( this ), this.refresh );
    
    };                   
    
    // Остановка прокрутки 
    Scroller.prototype.scrollStop = function () {
        window.clearInterval( this.interval );
    };
    
    
    $.fn.scrollDiv = function( options ) {
        // Настройки поумолчанию
        var defaults = {
            interval       : 1,
            step           : 1.5,
            opacityInitial : '0.1',
            opacityHover   : '0.6'
        };                                      
        
        // Дополнительные настройки пользователя
        var settings = $.extend( defaults, options );
        
        //Применяем плагин к набору елементов
        return this.each( function( elem ) {
            new Scroller( this, settings ) 
        });
    };

})(jQuery);