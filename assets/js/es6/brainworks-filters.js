($ => {
  $(document).ready(() => {
    const filters = new BWProductFilters(
      ".bw-product-filters",
      ".bw-product-list",
      ".bw-product-pagination",
      ".bw-products-sort"
    );

    filters.init(true);
  });

  // DOM Elements to clone
  let div = $("<div />"),
    label = $("<label />"),
    span = $("<span />"),
    li = $("<li />"),
    ul = $("<ul />"),
    a = $("<a />"),
    h4 = $("<h4 />"),
    img = $("<img />");

  let filterGroupHeader = $("<h3 />").addClass("bw-product-filters-header"),
    filterGroupUl = ul.clone(),
    filterGroupItem = li
      .clone()
      .append(label.clone().append($("<input />").attr("type", "checkbox")));

  class BWProductFilters {
    /**
     * @param {string} filtersSelector
     * @param {string} listSelector
     */
    constructor(
      filtersSelector,
      listSelector,
      paginationSelector,
      sortSelector
    ) {
      this.$filters = $(filtersSelector);
      this.$list = $(listSelector);
      this.$pagination = $(paginationSelector);
      this.$sort = $(sortSelector);

      if (!this.$filters.length || !this.$list.length) return;

      const endpoints = this.$filters.attr("data-endpoints").split("|");

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
        get: function() {
          return this._filters;
        },
        set: function(values) {
          this._filters = values;
          this._renderFilterList(values);
          return values;
        }
      });

      Object.defineProperty(this, "products", {
        get: function() {
          return this._products;
        },
        set: function(values) {
          this._products = values;
          this._renderProductList(values);
          return values;
        }
      });

      if (this.$sort.length) {
        this.$sort.on("change", this._changeSortType.bind(this));
      }
    }

    /**
     * @param {boolean} force
     */
    init() {
      this._restore().then(() => {
        this.getProducts();
        this.getFilters();

        if (this.restored) {
          this._changeSortOption(this.productsData.sort);
        }
      });
    }

    /**
     * @returns {void}
     */
    getFilters() {
      request(this.endpoints.filters).then(response => {
        this.filters = response;
      });
    }

    /**
     * @returns {void}
     */
    getProducts(success) {
      request(
        this.prepareRequest(this.endpoints.products, this.prepareQuery())
      ).then(response => {
        this.products = response.items;
        this.count = response.count * 1;
        if (!this.paginationRendered) {
          this._renderPagination();
          this.paginationRendered = true;
        }

        if (typeof success === "function") {
          success();
        }
      });
    }

    prepareRequest(url, params) {
      const urlobj = new URL(location.origin + url),
        filtersKeys = Object.keys(this.activeFilters);

      Object.keys(params).forEach(key => {
        urlobj.searchParams.append(key, params[key].toString());
      });

      if (filtersKeys.length) {
        urlobj.searchParams.append("attributes", filtersKeys);
      }

      return urlobj;
    }

    prepareQuery() {
      return {
        ...this.activeFilters,
        ...this.productsData
      };
    }

    _renderFilterList(filters) {
      const keys = Object.keys(filters);
      Object.values(this.filters)
        .map((f, x) => this._renderFilterGroup(f.label, f.values, keys[x]))
        .forEach(f => this.$filters.append(f));

      if (this.restored) this._checkFilters();
    }

    _renderFilterGroup(label, list, key) {
      return div
        .clone()
        .append(filterGroupHeader.clone().text(label)) 
        .append(
          filterGroupUl
            .clone()
            .attr("id", key)
            .append(list.map(i => this._renderFilterItem(i, key)))
        );
    }

    _renderFilterItem(value, key) {
      return filterGroupItem
        .clone()
        .find("label")
        .addClass("custom-checkbox")
        .append(span.clone().html(value))
        .find("input")
        .val(value)
        .on("change", this._changeFilters.bind(this, value, key))
        .end()
        .end();
    }

    _changeFilters(value, key) {
      if (!this.activeFilters[key]) {
        this.activeFilters[key] = [value];
      } else {
        if (this.activeFilters[key].indexOf(value) !== -1) {
          this.activeFilters[key] = this.activeFilters[key].filter(
            i => i !== value
          );
          if (!this.activeFilters[key].length) {
            delete this.activeFilters[key];
          }
        } else {
          this.activeFilters[key].push(value);
        }
      }

      this._updateFilters();
    }

    _resetFilters() {
      this.activeFilters = {};
      this._updateFilters();
    }

    _updateFilters() {
      this._runFiltersLoading();
      this._updateHash();
      this.getProducts(() => this._stopFiltersLoading());
    }

    _checkFilters() {
      for (let i in this.activeFilters) {
        $(`#${i}`).each((x, e) => {
          let $el = $(e);
          $el.find("input[type=checkbox]").each((x, inp) => {
            let $inp = $(inp);
            if (this.activeFilters[i].indexOf($inp.val()) !== -1) {
              $inp.prop("checked", true);
            }
          });
        });
      }
    }

    _runFiltersLoading() {
      this.$filters.addClass("_loading");
    }

    _stopFiltersLoading() {
      this.$filters.removeClass("_loading");
    }

    _renderProductList(values) {
      this.$list.html("").append(values.map(i => this._renderProductItem(i)));
    }

    _renderProductItem(value) {
      return li.clone().append(
        a
          .clone()
          .attr("href", value.permalink)
          .append(img.clone().attr("src", value.feature_image))
          .append(h4.clone().text(value.title))
          .append(
            span
              .clone()
              .addClass("price")
              .html(`${value.price}`)
          )
          .append(
            a
              .clone()
              .addClass("button-medium")
              .text(value.button_text)
          )
      );
    }

    _renderPagination() {
      if (this.count <= this.productsData.per_page) {
        this.$pagination.hide().html("");
        return;
      }

      const { page, per_page } = this.productsData;

      let items = [],
        minPage = 1,
        maxPage = Math.ceil(this.count / per_page);

      for (let i = 0; i < maxPage; i++) {
        items.push(this._renderPaginationItem(i + 1, page === i + 1));
      }

      this.$pagination.append(items);
    }

    _renderPaginationItem(page, active) {
      return li
        .clone()
        .append(span.clone().text(page))
        .addClass(
          active || (this.restored ? this.productsData.page == page : false)
            ? "_active"
            : null
        )
        .on("click", this._updatePagination.bind(this, page));
    }

    _updatePagination(page) {
      this.productsData.page = page;
      this._updateHash();
      this.getProducts();

      this.$pagination
        .find("li")
        .removeClass("_active")
        .eq(page - 1)
        .addClass("_active");
    }

    _changeSortType(e, readyValue) {
      let value = readyValue ? e : e.target.value;

      this.productsData.sort = value;
      this._updateHash();
      this.getProducts();
    }

    _changeSortOption(val) {
      this.$sort
        .find("option")
        .prop("selected", false)
        .each((_, e) => {
          let $el = $(e);
          if ($el.val() === val) {
            $el.prop("selected", true);
          }
        });
    }

    _updateHash() {
      let currentHash = location.hash,
        filters = this.activeFilters,
        page = this.productsData.page,
        sort = this.productsData.sort,
        fKeys = Object.keys(filters),
        params = {};

      if (fKeys.length) params.attributes = fKeys;
      if (sort !== "none") params.sort = sort;
      if (page !== 1) params.page = page;

      fKeys.forEach(key => (params[key] = filters[key].toString()));

      location.hash = this._stringifyHash(params);
    }

    _parseHash(hash) {
      if (hash[0] === "#") {
        hash = hash.slice(1);
        let hashParts = hash
            .split("&")
            .map(i => i.split("=").map(i => i.split(","))),
          response = {};
        hashParts.forEach(
          i =>
            (response[i[0][0]] =
              i[1].length > 1 || i[0][0] === "attributes"
                ? i[1]
                : i[1].toString())
        );
        return response;
      } else {
        return {};
      }
    }

    _stringifyHash(params) {
      let hash = [];
      for (let i in params) {
        hash.push(i + "=" + params[i].toString());
      }
      return `#${hash.join("&")}`;
    }

    _restore() {
      return new Promise(resolve => {
        let { hash } = location,
          params = this._parseHash(hash);
        if (params.page) {
          this.productsData.page = params.page;
        }
        if (params.sort) {
          this.productsData.sort = params.sort;
        }
        if (params.attributes) {
          params.attributes.forEach(i => {
            this.activeFilters[i] = [...decodeURI(params[i]).split(",")];
          });
        }
        if (hash && (params.page || params.sort || params.attributes))
          this.restored = true;
        resolve();
      });
    }
  }
})(jQuery);
