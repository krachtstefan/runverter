require "spec_helper"

describe ConverterController do
  describe "routing" do
    it "routes to #index" do
      expect(get("/")).to(route_to("converter#index"))
    end
  end
end