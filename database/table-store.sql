CREATE TABLE store (
  id INT PRIMARY KEY,
  price DECIMAL(10, 2),
  name VARCHAR(255),
  amount INT,
  img_path VARCHAR(255),
  category_name VARCHAR(255),
);

INSERT INTO store (id, price, name, amount, img_path, category_name) VALUES
(1, 199.99, 'Car Cover', 50, 'images/store/car_cover.jpg', 'Accessories'),
(2, 79.99, 'Floor Mats', 100, 'images/store/floor_mats.jpg', 'Accessories'),
(3, 149.99, 'Roof Rack', 30, 'images/store/roof_rack.jpg', 'Accessories'),
(4, 49.99, 'Windshield Wipers', 200, 'images/store/windshield_wipers.jpg', 'Parts'),
(5, 299.99, 'Car Battery', 40, 'images/store/car_battery.jpg', 'Parts'),
(6, 129.99, 'Spark Plugs', 150, 'images/store/spark_plugs.jpg', 'Parts'),
(7, 89.99, 'Brake Pads', 120, 'images/store/brake_pads.jpg', 'Parts'),
(8, 349.99, 'Alloy Wheels', 25, 'images/store/alloy_wheels.jpg', 'Accessories'),
(9, 59.99, 'LED Headlights', 80, 'images/store/led_headlights.jpg', 'Parts'),
(10, 199.99, 'Car Stereo', 60, 'images/store/car_stereo.jpg', 'Accessories');
