var MasterClass = {

	initGooglePlacesAutocomplete: function(skipVisibilityCheck) {
		var o = this;
		var gPlaceComponents = initComponents();

		if (gPlaceComponents.street_number.field.length && gPlaceComponents.street_number.field.length == 1) {
			gPlaceAutocomplete = new google.maps.places.Autocomplete(
				(gPlaceComponents.street_number.field[0]),
				{types: ['address']}
			);
			gPlaceAutocomplete.addListener('place_changed', function() {
				gPlaceComponents = initComponents();
				var place = this.getPlace();

				// clear input fields
				for (var comp in gPlaceComponents) {
					gPlaceComponents[comp].field.each(function() {
						$(this).val('');
					});
				}

				// fill in input fields
				place.address_components.forEach(function(comp) {
					comp.types.forEach(function(type) {
						if (gPlaceComponents[type]) {
							var compVal = comp[gPlaceComponents[type].type];
							gPlaceComponents[type].field.each(function() {
								if ($(this).attr('onfocus') && !skipVisibilityCheck) {
									eval($(this).attr('onfocus'));
								}
								if ($(this).is('select')) {
									$(this).find('option[value="'+compVal.toUpperCase()+'"]')
										.prop('selected', true)
										.trigger('change');
								} else {
									if (type == 'route') {
										$(this).val() ? $(this).val($(this).val().concat(' '+compVal)) : $(this).val(compVal);
									} else {
										$(this).val(compVal);
									}
								}
								if ($(this).attr('onblur') && !skipVisibilityCheck) {
									eval($(this).attr('onblur'));
								}
							});
						}
					});
				});
			});

			var countryVal;
			$('input[id="country"]:hidden').each(function() {
				if ($(this).val()) {
					countryVal = $(this).val();
				}
			});

			if (countryVal) {
				gPlaceAutocomplete.setOptions({
					strictBounds: true,
					componentRestrictions: {country: countryVal}
				});
			}

			$('#_select_ShippingAddresses').change(function() {
				o.initGooglePlacesAutocomplete();
			});

			$('#_enter_new_address a').click(function() {
				o.initGooglePlacesAutocomplete(true);
			});
		} // END if
		else {
			console.log(gPlaceComponents.street_number.field);
			console.log('The autocomplete field is missing or multiple autocomplete fields are found.');
		}

		function initComponents() {
			// add selectors to jQuery below
			// for example: 'input[data-id="QAS_lineone"]:enabled' is used in recipient page
			// 				'input[data-id="WC_ShoppingCartAddressEntryForm_FormInput_address1_1"]:enabled' is used in placeorder page
			var autocompleteField = $('input[data-id="QAS_lineone"]:enabled,input[data-id="WC_ShoppingCartAddressEntryForm_FormInput_address1_1"]:enabled');
			var cityField = $('input[data-id="WC_ShoppingCartAddressEntryForm_FormInput_city_1"]:enabled,input[data-id="QAS_city"]:enabled');
			var stateField = $('select[data-id="billing_state"]:enabled,select[data-id="state"]:enabled');
			var zipField = $('input[data-id="WC_ShoppingCartAddressEntryForm_FormInput_zipCode_1"]:enabled,input[data-id="zip"]:enabled,input[data-id="zip1"],input[data-id="editZipCode"]');
			var countryField = $('select[data-id="WC_ShoppingCartAddressEntryForm_FormInput_country_1"]:enabled');
			return {
				street_number: { type:'short_name', field:autocompleteField },
				route: { type:'long_name', field:autocompleteField },
				locality: { type:'long_name', field:cityField },
				administrative_area_level_1: { type:'short_name', field:stateField },
				postal_code: { type:'short_name', field:zipField },
				country: { type:'short_name', field:countryField }
			};
		}
	}

};