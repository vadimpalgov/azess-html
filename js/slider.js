'use strict';
var multiItemSlider = (function () {
    return function (selector) {
        let
            _mainElement = document.querySelector(selector), // основный элемент блока
            _sliderWrapper = _mainElement.querySelector('.slider-wrapper'), // обертка для .slider-item
            _sliderItems = _mainElement.querySelectorAll('.slider-item'), // элементы (.slider-item)
            _sliderControls = document.querySelectorAll('.slider-control'), // элементы управления
            _sliderControlLeft = document.querySelector('.slider-control_left'), // кнопка "LEFT"
            _sliderControlRight = document.querySelector('.slider-control_right'), // кнопка "RIGHT"
            _wrapperWidth = parseFloat(getComputedStyle(_sliderWrapper).width), // ширина обёртки
            _itemWidth = parseFloat(getComputedStyle(_sliderItems[0]).width), // ширина одного элемента
            _positionLeftItem = 0, // позиция левого активного элемента
            _transform = 0, // значение трансформации .slider_wrapper
            _step = _itemWidth / _wrapperWidth * 100, // величина шага (для трансформации)
            _items = []; // массив элементов
        console.log(_sliderWrapper);
        // наполнение массива _items
        _sliderItems.forEach(function (item, index) {
            _items.push({ item: item, position: index, transform: 0 });
        });

        let position = {
            getMin: 0,
            getMax: _items.length - 1,
        }

        let _transformItem = function (direction) {
            if (direction === 'right') {
                if ((_positionLeftItem + _wrapperWidth / _itemWidth - 1) >= position.getMax) {
                    return;
                }
                if (!_sliderControlLeft.classList.contains('slider-control_show')) {
                    _sliderControlLeft.classList.add('slider-control_show');
                }
                if (_sliderControlRight.classList.contains('slider-control_show') && (_positionLeftItem + _wrapperWidth / _itemWidth) >= position.getMax) {
                    _sliderControlRight.classList.remove('slider-control_show');
                }
                _positionLeftItem++;
                _transform -= _step;
            }
            if (direction === 'left') {
                if (_positionLeftItem <= position.getMin) {
                    return;
                }
                if (!_sliderControlRight.classList.contains('slider-control_show')) {
                    _sliderControlRight.classList.add('slider-control_show');
                }
                if (_sliderControlLeft.classList.contains('slider-control_show') && _positionLeftItem - 1 <= position.getMin) {
                    _sliderControlLeft.classList.remove('slider-control_show');
                }
                _positionLeftItem--;
                _transform += _step;
            }
            _sliderWrapper.style.transform = 'translateX(' + _transform + '%)';
        }

        // обработчик события click для кнопок "назад" и "вперед"
        let _controlClick = function () {
            let direction = this.classList.contains('slider-control_right') ? 'right' : 'left';
            _transformItem(direction);
        };

        let _setUpListeners = function () {
            // добавление к кнопкам "назад" и "вперед" обработчика _controlClick для события click
            _sliderControls.forEach(function (item) {
                item.addEventListener('click', _controlClick);
            });

            _sliderWrapper.addEventListener('wheel',function (e) {
                let delta = e.deltaY || e.detail || e.wheelDelta;

                if(delta > 0){
                    _transformItem('right');
                } else {
                    _transformItem('left');
                }
            });

        }

        // инициализация
        _setUpListeners();

        return {
            right: function () { // метод right
                _transformItem('right');
            },
            left: function () { // метод left
                _transformItem('left');
            }
        }

    }
}());

