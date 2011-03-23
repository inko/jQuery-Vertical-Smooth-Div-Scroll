/*
Copyright (c) 2011, Manyakhin Valentine All rights reserved.
Redistribution and use in source and binary forms, with or without 
modification, are permitted provided that the following conditions are met:
    -Redistributions of source code must retain the above copyright notice, 
     this list of conditions and the following disclaimer.
    -Redistributions in binary form must reproduce the above copyright notice,
     this list of conditions and the following disclaimer in the documentation 
     and/or other materials provided with the distribution.
    -Neither the name of the <ORGANIZATION> nor the names of its contributors 
     may be used to endorse or promote products derived from this software 
     without specific prior written permission.
     
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" 
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE 
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE 
ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE 
LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR 
CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF 
SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS 
INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN 
CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) 
ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE 
POSSIBILITY OF SUCH DAMAGE.
*/
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
        
        // ( Костыль ) Высотакнопки прокрутки
        this.scrollButtonHeight = options.scrollButtonHeight;
        
        // Обработка событий поподания в облать кнопк вверх 
        $( this.down ).hover(
            function() {
                $( this.down ).css( 'opacity', '0.6' );
                this.scrollDown();
            }.context( this ),
        
            function() {
                $( this.down ).css( 'opacity', '0.1' );
                this.scrollStop();
            }.context( this )
        );
        
        // Обработка событий поподания в облать кнопки вверх 
        $( this.up ).hover(
            function() {                          
                $( this.up ).css( 'opacity', '0.6' );
                this.scrollUp();
            }.context( this ),
        
            function() {                              
                $( this.up ).css( 'opacity', '0.1' );
                this.scrollStop();
            }.context( this )
        );
    
    
    }
    
    // Прокрутка вверх
    Scroller.prototype.scrollUp = function () {
          this.interval = window.setInterval( function () {
              this.delta -= this.step;
              if( ( this.delta - this.scrollButtonHeight ) > 0 ) {
                  $( this.scroll ).css( { 'margin-top' : ( this.delta * -1 ) + 'px' } );
                 } else {
                     this.scrollStop();
                 }
         }.context( this ), this.refresh );
    };
    
    // Прокрутка вниз
    Scroller.prototype.scrollDown = function () {
        this.interval = window.setInterval( function () { 
             this.delta += this.step;                       
             
             var childrens_height = 0;
             var childrens = $(this.scroll).children();
             var childrens_count = childrens.length;
             
             for( var i = 0; i < childrens_count; i++ ) {
                 childrens_height += $(childrens[i]).height();
             }
             
             var maxdelta = ( childrens_height ) - $(this.scroll).height() + this.scrollButtonHeight;
             
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
            opacityHover   : '0.6',
            scrollButtonHeight : 40
        };                                      
        
        // Дополнительные настройки пользователя
        var settings = $.extend( defaults, options );
        
        //Применяем плагин к набору елементов
        return this.each( function( elem ) {
            new Scroller( this, settings ) 
        });
    };

})($);