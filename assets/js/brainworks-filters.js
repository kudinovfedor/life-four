"use strict";

function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
}

function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
        for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {
            arr2[i] = arr[i];
        }
        return arr2;
    }
}

function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _defineProperty(target, key, source[key]);
        });
    }
    return target;
}

function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}

function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}

(function($) {
    $(document).ready(function() {
        var filters = new BWProductFilters(".bw-product-filters", ".bw-product-list", ".bw-product-pagination", ".bw-products-sort");
        filters.init(true);
    });
    var div = $("<div />"), label = $("<label />"), span = $("<span />"), li = $("<li />"), ul = $("<ul />"), a = $("<a />"), h4 = $("<h4 />"), img = $("<img />");
    var filterGroupHeader = $("<h3 />").addClass("bw-product-filters-header"), filterGroupUl = ul.clone(), filterGroupItem = li.clone().append(label.clone().append($("<input />").attr("type", "checkbox")));
    var BWProductFilters = function() {
        function BWProductFilters(filtersSelector, listSelector, paginationSelector, sortSelector) {
            _classCallCheck(this, BWProductFilters);
            this.$filters = $(filtersSelector);
            this.$list = $(listSelector);
            this.$pagination = $(paginationSelector);
            this.$sort = $(sortSelector);
            if (!this.$filters.length || !this.$list.length) return;
            var endpoints = this.$filters.attr("data-endpoints").split("|");
            this.endpoints = {
                filters: endpoints[0],
                products: endpoints[1],
                count: endpoints[2]
            };
            this.productsData = {
                page: 1,
                per_page: 12,
                sort: "none"
            };
            this.restored = false;
            this.count = 0;
            this.paginationRendered = false;
            this.activeFilters = {};
            Object.defineProperty(this, "filters", {
                get: function get() {
                    return this._filters;
                },
                set: function set(values) {
                    this._filters = values;
                    this._renderFilterList(values);
                    return values;
                }
            });
            Object.defineProperty(this, "products", {
                get: function get() {
                    return this._products;
                },
                set: function set(values) {
                    this._products = values;
                    this._renderProductList(values);
                    return values;
                }
            });
            if (this.$sort.length) {
                this.$sort.on("change", this._changeSortType.bind(this));
            }
        }
        _createClass(BWProductFilters, [ {
            key: "init",
            value: function init() {
                var _this = this;
                this._restore().then(function() {
                    _this.getProducts();
                    _this.getFilters();
                    if (_this.restored) {
                        _this._changeSortOption(_this.productsData.sort);
                    }
                });
            }
        }, {
            key: "getFilters",
            value: function getFilters() {
                var _this2 = this;
                request(this.endpoints.filters).then(function(response) {
                    _this2.filters = response;
                });
            }
        }, {
            key: "getProducts",
            value: function getProducts(success) {
                var _this3 = this;
                request(this.prepareRequest(this.endpoints.products, this.prepareQuery())).then(function(response) {
                    _this3.products = response.items;
                    _this3.count = response.count * 1;
                    if (!_this3.paginationRendered) {
                        _this3._renderPagination();
                        _this3.paginationRendered = true;
                    }
                    if (typeof success === "function") {
                        success();
                    }
                });
            }
        }, {
            key: "prepareRequest",
            value: function prepareRequest(url, params) {
                var urlobj = new URL(location.origin + url), filtersKeys = Object.keys(this.activeFilters);
                Object.keys(params).forEach(function(key) {
                    urlobj.searchParams.append(key, params[key].toString());
                });
                if (filtersKeys.length) {
                    urlobj.searchParams.append("attributes", filtersKeys);
                }
                return urlobj;
            }
        }, {
            key: "prepareQuery",
            value: function prepareQuery() {
                return _objectSpread({}, this.activeFilters, this.productsData);
            }
        }, {
            key: "_renderFilterList",
            value: function _renderFilterList(filters) {
                var _this4 = this;
                var keys = Object.keys(filters);
                Object.values(this.filters).map(function(f, x) {
                    return _this4._renderFilterGroup(f.label, f.values, keys[x]);
                }).forEach(function(f) {
                    return _this4.$filters.append(f);
                });
                if (this.restored) this._checkFilters();
            }
        }, {
            key: "_renderFilterGroup",
            value: function _renderFilterGroup(label, list, key) {
                var _this5 = this;
                return div.clone().append(filterGroupHeader.clone().text(label)).append(filterGroupUl.clone().attr("id", key).append(list.map(function(i) {
                    return _this5._renderFilterItem(i, key);
                })));
            }
        }, {
            key: "_renderFilterItem",
            value: function _renderFilterItem(value, key) {
                return filterGroupItem.clone().find("label").addClass("custom-checkbox").append(span.clone().html(value)).find("input").val(value).on("change", this._changeFilters.bind(this, value, key)).end().end();
            }
        }, {
            key: "_changeFilters",
            value: function _changeFilters(value, key) {
                if (!this.activeFilters[key]) {
                    this.activeFilters[key] = [ value ];
                } else {
                    if (this.activeFilters[key].indexOf(value) !== -1) {
                        this.activeFilters[key] = this.activeFilters[key].filter(function(i) {
                            return i !== value;
                        });
                        if (!this.activeFilters[key].length) {
                            delete this.activeFilters[key];
                        }
                    } else {
                        this.activeFilters[key].push(value);
                    }
                }
                this._updateFilters();
            }
        }, {
            key: "_resetFilters",
            value: function _resetFilters() {
                this.activeFilters = {};
                this._updateFilters();
            }
        }, {
            key: "_updateFilters",
            value: function _updateFilters() {
                var _this6 = this;
                this._runFiltersLoading();
                this._updateHash();
                this.getProducts(function() {
                    return _this6._stopFiltersLoading();
                });
            }
        }, {
            key: "_checkFilters",
            value: function _checkFilters() {
                var _this7 = this;
                var _loop = function _loop(i) {
                    $("#".concat(i)).each(function(x, e) {
                        var $el = $(e);
                        $el.find("input[type=checkbox]").each(function(x, inp) {
                            var $inp = $(inp);
                            if (_this7.activeFilters[i].indexOf($inp.val()) !== -1) {
                                $inp.prop("checked", true);
                            }
                        });
                    });
                };
                for (var i in this.activeFilters) {
                    _loop(i);
                }
            }
        }, {
            key: "_runFiltersLoading",
            value: function _runFiltersLoading() {
                this.$filters.addClass("_loading");
            }
        }, {
            key: "_stopFiltersLoading",
            value: function _stopFiltersLoading() {
                this.$filters.removeClass("_loading");
            }
        }, {
            key: "_renderProductList",
            value: function _renderProductList(values) {
                var _this8 = this;
                this.$list.html("").append(values.map(function(i) {
                    return _this8._renderProductItem(i);
                }));
            }
        }, {
            key: "_renderProductItem",
            value: function _renderProductItem(value) {
                return li.clone().append(a.clone().attr("href", value.permalink).append(img.clone().attr("src", value.feature_image)).append(h4.clone().text(value.title)).append(span.clone().addClass("price").html("".concat(value.price))).append(a.clone().addClass("button-medium").text(value.button_text)));
            }
        }, {
            key: "_renderPagination",
            value: function _renderPagination() {
                if (this.count <= this.productsData.per_page) {
                    this.$pagination.hide().html("");
                    return;
                }
                var _this$productsData = this.productsData, page = _this$productsData.page, per_page = _this$productsData.per_page;
                var items = [], minPage = 1, maxPage = Math.ceil(this.count / per_page);
                for (var i = 0; i < maxPage; i++) {
                    items.push(this._renderPaginationItem(i + 1, page === i + 1));
                }
                this.$pagination.append(items);
            }
        }, {
            key: "_renderPaginationItem",
            value: function _renderPaginationItem(page, active) {
                return li.clone().append(span.clone().text(page)).addClass(active || (this.restored ? this.productsData.page == page : false) ? "_active" : null).on("click", this._updatePagination.bind(this, page));
            }
        }, {
            key: "_updatePagination",
            value: function _updatePagination(page) {
                this.productsData.page = page;
                this._updateHash();
                this.getProducts();
                this.$pagination.find("li").removeClass("_active").eq(page - 1).addClass("_active");
            }
        }, {
            key: "_changeSortType",
            value: function _changeSortType(e, readyValue) {
                var value = readyValue ? e : e.target.value;
                this.productsData.sort = value;
                this._updateHash();
                this.getProducts();
            }
        }, {
            key: "_changeSortOption",
            value: function _changeSortOption(val) {
                this.$sort.find("option").prop("selected", false).each(function(_, e) {
                    var $el = $(e);
                    if ($el.val() === val) {
                        $el.prop("selected", true);
                    }
                });
            }
        }, {
            key: "_updateHash",
            value: function _updateHash() {
                var currentHash = location.hash, filters = this.activeFilters, page = this.productsData.page, sort = this.productsData.sort, fKeys = Object.keys(filters), params = {};
                if (fKeys.length) params.attributes = fKeys;
                if (sort !== "none") params.sort = sort;
                if (page !== 1) params.page = page;
                fKeys.forEach(function(key) {
                    return params[key] = filters[key].toString();
                });
                location.hash = this._stringifyHash(params);
            }
        }, {
            key: "_parseHash",
            value: function _parseHash(hash) {
                if (hash[0] === "#") {
                    hash = hash.slice(1);
                    var hashParts = hash.split("&").map(function(i) {
                        return i.split("=").map(function(i) {
                            return i.split(",");
                        });
                    }), response = {};
                    hashParts.forEach(function(i) {
                        return response[i[0][0]] = i[1].length > 1 || i[0][0] === "attributes" ? i[1] : i[1].toString();
                    });
                    return response;
                } else {
                    return {};
                }
            }
        }, {
            key: "_stringifyHash",
            value: function _stringifyHash(params) {
                var hash = [];
                for (var i in params) {
                    hash.push(i + "=" + params[i].toString());
                }
                return "#".concat(hash.join("&"));
            }
        }, {
            key: "_restore",
            value: function _restore() {
                var _this9 = this;
                return new Promise(function(resolve) {
                    var _location = location, hash = _location.hash, params = _this9._parseHash(hash);
                    if (params.page) {
                        _this9.productsData.page = params.page;
                    }
                    if (params.sort) {
                        _this9.productsData.sort = params.sort;
                    }
                    if (params.attributes) {
                        params.attributes.forEach(function(i) {
                            _this9.activeFilters[i] = _toConsumableArray(decodeURI(params[i]).split(","));
                        });
                    }
                    if (hash && (params.page || params.sort || params.attributes)) _this9.restored = true;
                    resolve();
                });
            }
        } ]);
        return BWProductFilters;
    }();
})(jQuery);