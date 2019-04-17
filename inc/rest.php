<?php 

    function rest_get_filters(WP_REST_Request $req) {

        $products = wc_get_products([
            'number' => -1
        ]);

        $response = [];
        $disabled_terms = ['pa_load'];

        foreach ($products as $product) {
            $attributes = $product->get_attributes();
            foreach ($attributes as $attribute) {
                $name = $attribute->get_name();
                $label = wc_attribute_label( $name, $product->id );
                $values = woocommerce_get_product_terms($product->id, $name);
                if (in_array($name, $disabled_terms)) 
                    continue;
                if (isset($response[$name])) {
                    foreach ($values as $val) {
                        if (!in_array($val->name, $response[$name]['values'])) {
                            array_push($response[$name]['values'], $val->name);
                        }
                    }
                } else {
                    $response[$name] = [
                        'label' => $label,
                        'values' => [] 
                    ];

                    foreach ($values as $val) {
                        $response[$name]['values'][] = $val->name;
                    }
                }
            }
        }

        return $response;

    }

    function rest_get_products(WP_REST_Request $req) {
        $page = $req->get_param('page');
        $per_page = $req->get_param('per_page');
        $attrs = $req->get_param('attributes');
        $sort = $req->get_param('sort');
        $product_attrs = [];

        if (!$attrs) {
            $attrs = null;
        } else {
            foreach (explode(',', $attrs) as $attr) {
                $val = $req->get_param($attr);
                if (!$val) {
                    $val = '';
                }
                $product_attrs[$attr] = explode(',', $val);
            }
        }

        $prepared = get_prepared_products($product_attrs, $page, $per_page, $sort);

        return ['items' => get_rest_products($prepared['items']), 'count' => $prepared['count']];
    }

    function register_routes() {
        register_rest_route('brainworks', 'filters', [
            'methods' => 'GET',
            'callback' => 'rest_get_filters'
        ]);

        register_rest_route('brainworks', 'products', [
            'methods' => 'GET',
            'callback' => 'rest_get_products'
        ]);
    }

    add_action('rest_api_init', 'register_routes');