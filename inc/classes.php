<?php 

    class BW_Rest_Product {
        public $id;

        public $title;

        public $permalink;

        public $price;

        public $feature_image;

        public $button_text;
        
        function __construct(WP_Post $post) {

            $this->id = $post->ID;

            $this->title = $post->post_title;

            $this->permalink = get_post_permalink($this->id);

            $this->price = get_post_meta($this->id, '_regular_price', true);

            if ($this->price === '0') {
                $this->price = __("БЕСПЛАТНО", "brainworks");
            } else {
                $this->price .= ' ' . get_woocommerce_currency_symbol();
            }

            $this->feature_image = get_the_post_thumbnail_url($this->id, 'medium');

            $this->button_text = __("Купить", "brainworks");
        }
    }