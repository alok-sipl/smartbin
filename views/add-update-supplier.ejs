<div class="normalheader transition animated fadeIn">
  <div class="hpanel">
    <div class="panel-body">
      <div class="row">
        <div class="col-md-6">
          <h2 class="font-light m-b-xs">
            <%= (Object.keys(supplier).length) ? 'Edit' : 'Add' %> Supplier
          </h2>
          <div id="hbreadcrumb">
            <ol class="hbreadcrumb breadcrumb">
              <li><a href="<%= sails.config.base_url %>dashboard">Dashboard</a></li>
              <li><a href="<%= sails.config.base_url %>supplier">Supplier List</a></li>
              <li class="active">
                <%= (Object.keys(supplier).length) ? 'Edit' : 'Add' %> Supplier</span>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
<div class="row">
  <div class="col-md-8">
    <div class="hpanel">
      <div class="panel-body">
        <% if(!(Object.keys(supplier).length)){ %>
        <form action="<%= sails.config.base_url %>supplier/add" method="post" enctype="multipart/form-data"
              id="add-supplier" class='form-horizontal' data-parsley-validate='true'>
          <% }else{ %>
          <form action="<%= sails.config.base_url %>supplier/edit/<%= req.params.id %>" method="post"
                enctype="multipart/form-data"
                id="add-supplier" class='form-horizontal' data-parsley-validate='true'>
            <% } %>

            <% if (req.session.flash) { %>
            <%- req.flash('flashMessage') %>
            <% } %>
            <div class="form-group <%= (errors.company_name != undefined) ? " has-error" : "" %>">
              <label for="company_name" class="col-md-4 control-label">Company Name*</label>
              <div class="col-md-6">
                <input type="text" name="company_name" class="form-control" id="company_name"
                       value="<%= (supplier.company_name) ? (supplier.company_name) : (req.param('company_name')) ? req.param('company_name') : '' %>"
                       required
                       maxlength="<%= sails.config.length.company_name %>"
                       data-parsley-required-message="<%= WaterSupplier.message.company_name_required %>"
                       data-parsley-maxlength-message="<%= WaterSupplier.message.company_name_maxlength %>"
                       pattern="<%= sails.config.regex.name %>"
                       data-parsley-pattern-message="<%= WaterSupplier.message.name_pattern %>"
                       placeholder="Company Name"/>
                <span class="help-block">
                <strong><%= (errors.company_name != undefined) ? errors.company_name.message : '' %>
                </strong>
              </span>
              </div>
            </div>
            <div class="form-group <%= (errors.name != undefined) ? " has-error" : "" %>">
              <label for="last_name" class="col-md-4 control-label">Name*</label>
              <div class="col-md-6">
                <input type="text" name="name" class="form-control" id="name" required
                       value="<%= (supplier.name) ? (supplier.name) : (req.param('name')) ? req.param('name') : '' %>"
                       maxlength="<%= sails.config.length.name %>"
                       data-parsley-required-message="<%= WaterSupplier.message.name_required %>"
                       data-parsley-maxlength-message="<%= WaterSupplier.message.name_maxlength %>"
                       pattern="<%= sails.config.regex.name %>"
                       data-parsley-pattern-message="<%= WaterSupplier.message.name_pattern %>"
                       placeholder="Name"/>
                <span class="help-block">
                <strong><%= (errors.name != undefined) ? errors.name.message : '' %>
                </strong>
              </span>
              </div>
            </div>
            <div class="form-group <%= (errors.email != undefined) ? " has-error" : "" %>">
              <label for="email" class="col-md-4 control-label">Email*</label>
              <div class="col-md-6">
                <input type="email" name="email" class="form-control" id="email" required
                       value="<%= (supplier.email) ? (supplier.email) : (req.param('email')) ? req.param('email') : '' %>"
                       maxlength="<%= sails.config.length.email %>" <%= (Object.keys(supplier).length) ? "disabled" : '' %>
                       data-parsley-type="email"
                       data-parsley-required-message="<%= WaterSupplier.message.email_required %>"
                       data-parsley-maxlength-message="<%= WaterSupplier.message.email_maxlength %>"
                       data-parsley-type-message="<%= WaterSupplier.message.email_valid %>"
                       placeholder="Email"/>
                <span class="help-block">
                <strong><%= (errors.email != undefined) ? errors.email.message : '' %>
                </strong>
              </span>
              </div>
            </div>
            <div class="form-group <%= (errors.mobile_number != undefined) ? " has-error" : "" %>">
              <label for="contact_no" class="col-md-4 control-label">Mobile Number*</label>
              <div class="col-md-6">
                <input type="text" name="mobile_number" class="form-control" id="mobile_number"
                       value="<%= (supplier.mobile_number) ? (supplier.mobile_number) : (req.param('mobile_number')) ? req.param('mobile_number') : '' %>"
                       required
                       data-parsley-length="[<%= sails.config.length.min_mobile_number %>, <%= sails.config.length.max_mobile_number %>]"
                       data-parsley-required-message="<%= WaterSupplier.message.mobile_number_required %>"
                       data-parsley-length-message="<%= WaterSupplier.message.mobile_number_length %>"
                       data-parsley-pattern-message="<%= WaterSupplier.message.mobile_number_pattern %>"
                       placeholder="Mobile Number"/>
                <span class="help-block">
                <strong><%= (errors.mobile_number != undefined) ? errors.mobile_number.message : '' %>
                </strong>
              </span>
              </div>
            </div>
            <div class="form-group <%= (errors.account_number != undefined) ? " has-error" : "" %>">
              <label for="contact_no" class="col-md-4 control-label">Account Number</label>
              <div class="col-md-6">
                <input type="text" name="account_number" class="form-control" id="account_number"
                       value="<%= (supplier.account_number) ? (supplier.account_number) : (req.param('account_number')) ? req.param('account_number') : '' %>"
                       maxlength="<%= sails.config.length.account_number %>"
                       data-parsley-type="alphanum"
                       data-parsley-length="[<%= sails.config.length.account_number %>, <%= sails.config.length.account_number %>]"
                       data-parsley-length-message="<%= WaterSupplier.message.account_number_length %>"
                       data-parsley-type-message="<%= WaterSupplier.message.account_number_alphanumeric %>"
                       placeholder="Account Number"/>
                <span class="help-block">
                <strong><%= (errors.account_number != undefined) ? errors.account_number.message : '' %>
                </strong>
              </span>
              </div>
              <div class="form-group <%= (errors.tank_size != undefined) ? " has-error" : "" %>">
                <label for="is_active" class="col-md-4 control-label">Tank Size*</label>
                <div class="col-md-6">
                  <div class="tank_type">
                    <input type="checkbox" class="tank_size" name="tank_size" value="1" checked> 5(m3)<br>
                    <input type="checkbox" class="tank_size" name="tank_size" value="2" checked> 12(m3)<br>
                    <input type="checkbox" class="tank_size" name="tank_size" value="3" checked> 18(m3)<br>
                    <input type="checkbox" class="tank_size" name="tank_size" value="4" checked> 32(m3)<br>
                  </div>
                  <input type="checkbox" name="tank_size" value="5" checked id="check_all"> All<br>
                  <span class="help-block">
                <strong><%= (errors.tank_size != undefined) ? errors.tank_size.message : '' %>
                </strong>
              </span>
                </div>
              </div>
              <div class="form-group <%= (errors.country != undefined) ? " has-error" : "" %>">
                <label for="is_active" class="col-md-4 control-label">Country*</label>
                <div class="col-md-6">
                  <select name="country" onchange="getCity(this.value)" id="country" class="form-control" required
                          data-parsley-required-message="<%= WaterSupplier.message.country_required %>">
                    <option value="">Select Country</option>
                    <%
                    if(Object.keys(countries).length){
                      for(var key in countries) { %>
                    <option <%= (supplier.country_id && supplier.country_id == key) ? "selected" : (req.param('country') && req.param('country') == key) ? "selected" : '' %>
                      value="<%= key %>"><%= countries[key].name %></option>
                    <% }
                    } %>
                  </select>
                  <input type="hidden" name="country_name" id="country_name" value="<%= (supplier.country_name) ? (supplier.country_name) : '' %>"/>
                  <span class="help-block">
                <strong><%= (errors.country != undefined) ? errors.country.message : '' %>
                </strong>
              </span>
                </div>
              </div>
              <div class="form-group <%= (errors.city != undefined) ? " has-error" : "" %>">
                <label for="is_active" class="col-md-4 control-label">City*</label>
                <div class="col-md-6">
                  <select name="city" onchange="getSubCity(this.value)" id="city" class="form-control" required
                          data-parsley-required-message="<%= WaterSupplier.message.city_required %>">
                    <option value="">Select City</option>
                    <%
                    if(Object.keys(cities).length){
                      for(var key in cities) { %>
                    <option <%= (supplier.city_id && supplier.city_id == key) ? "selected" : (req.param('city') && req.param('city') == key) ? "selected" : '' %>
                      value="<%= key %>"><%= cities[key].name %></option>
                    <% }
                    } %>
                  </select>
                  <input type="hidden" name="city_name" id="city_name" value="<%= (supplier.city_name) ? (supplier.city_name) : '' %>"/>
                  <span class="help-block">
                <strong><%= (errors.city != undefined) ? errors.cityId.message : '' %>
                </strong>
              </span>
                </div>
              </div>
              <div class="form-group <%= (errors.area != undefined) ? " has-error" : "" %>">
                <label for="is_active" class="col-md-4 control-label">Area*</label>
                <div class="col-md-6">
                  <input type="text" onFocus="geolocate()" name="area" class="form-control" required id="area"
                         value="<%= (supplier.area) ? (supplier.area) : (req.param('area')) ? req.param('area') : '' %>"
                         maxlength="<%= sails.config.length.address %>"
                         data-parsley-required-message="<%= WaterSupplier.message.area_required %>"
                         data-parsley-maxlength-message="<%= WaterSupplier.message.area_maxlength %>"
                         placeholder="Area"/>
                  <span class="help-block">
                <strong><%= (errors.area != undefined) ? errors.area.message : '' %>
                </strong>
              </span>
                  <input type="hidden" name="latitude" id="latitude" value="<%= (supplier.latitude) ? (supplier.latitude) : (req.param('latitude')) ? req.param('latitude') : '' %>"/>
                  <input type="hidden" name="longitude" id="longitude" value="<%= (supplier.longitude) ? (supplier.longitude) : (req.param('longitude')) ? req.param('longitude') : '' %>"/>
                </div>
              </div>
              <div class="form-group <%= (errors.company_image != undefined) ? " has-error" : "" %>">
                <label for="is_active" class="col-md-4 control-label">Company Logo*</label>
                <div class="col-md-6">
                  <% if(Object.keys(supplier).length){ %>
                  <img width="100"
                       src="<%= (supplier.compnay_image) ? supplier.compnay_image : sails.config.base_url + 'images/profile.png' %>"
                       title="<%= (supplier.name) ? supplier.name : '' %>"
                       alt="<%= (supplier.name) ? supplier.name : '' %>">
                  <% } %>
                  <input type="file" class="form-control" name="company_image" id="company_image"
                    <% if(!Object.keys(supplier).length){ %>
                         required
                         data-parsley-required-message="<%= WaterSupplier.message.company_image_required %>"
                    <% } %>
                         data-parsley-max-file-size="<%= sails.config.length.max_file_upload_kb %>"/>
                  <span class="help-block">
                <strong><%= (errors.company_image != undefined) ? errors.company_image.message : '' %>
                </strong>
              </span>
                </div>
              </div>
              <div class="form-group <%= (errors.account_number != undefined) ? " has-error" : "" %>">
                <div class="col-md-8 col-md-offset-4">
                  <button type="submit" class="btn btn-primary">
                    <%= (Object.keys(supplier).length) ? 'Update' : 'Add' %> Supplier
                  </button>
                  <a class="btn btn-primary" href="<%= sails.config.base_url %>supplier">Cancel</a>
                </div>
              </div>
            </div>
          </form>
      </div>
    </div>
  </div>
</div>
