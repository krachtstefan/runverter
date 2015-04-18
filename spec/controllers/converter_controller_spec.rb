require 'spec_helper'

describe ConverterController do
  render_views
  describe "GET #index" do
    it "responds with HTTP 200 status code" do
      get :index
      expect(response).to be_success
      expect(response.status).to eq(200)
    end

    it "renders the index template" do
      get :index
      expect(response).to render_template("index")
    end
  end
end