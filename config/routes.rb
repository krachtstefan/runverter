Rails.application.routes.draw do
  root to: 'converter#index'
  match '*path' => redirect('/'), :via => [:get]
end