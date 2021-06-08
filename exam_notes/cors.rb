# rent_a_pet_api/config/initializers/cors.rb

Rails.application.config.middleware.insert_before 0, Rack::Cors do
    allow do
      origins 'localhost:5500', '127.0.0.1:5500'
  
      resource(
        '/api/*',
        headers: :any,
        credentials: true,
        methods: [:get, :post, :delete, :patch, :put, :options]
      )
    end
  end
  