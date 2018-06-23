let handleRoute = require('../../middlewares/handleRoute.js');

let { shuffleArray } = require('../../libs/helpers.js');
let { createGallery } = require('../../libs/bots.js');
let { getServiceByID } = require('../../libs/data/services.js');
let { sortProviders, filterProvidersByService } = require('../../libs/data/providers.js');
let { getProviders, toGalleryElement } = require('../../libs/services/providers.js');
let { createLastGalleryElement } = require('../../libs/providers/providers.js');

let express = require('express');
let router = express.Router();

let searchServiceProviders = async ({ query }, res) => {
  let { service_id } = query;
  let service = await getServiceByID({ service_id });
  let service_name = service.fields['Name'];

  let set_attributes = { service_id, service_name };
  let redirect_to_blocks = ['Search Service Providers'];
  res.send({ set_attributes, redirect_to_blocks });
}

let getServiceProviders = async ({ query, params }, res) => {
  let { search_type } = params;

  let { messenger_user_id, first_name, last_name, gender } = query;
  let { service_id, search_service_providers_state, search_service_providers_city, search_service_providers_zip_code } = query;

  let service = await getServiceByID({ service_id });
  let service_name = service.fields['Name'];

  let providers = await getProviders(
    { search_type, search_service_providers_state, search_service_providers_city, search_service_providers_zip_code }
  );

  let providersByService = (providers[0]) ? filterProvidersByService(service_name, providers) : [];

  if (!providersByService[0]) {
    let set_attributes = { service_name }
    let redirect_to_blocks = ['No Service Providers Found'];
    res.send({ set_attributes, redirect_to_blocks });
    return;
  }

  let randomProviders = shuffleArray(providersByService).slice(0, 9).sort(sortProviders).map(
    toGalleryElement({ first_name, last_name, gender, messenger_user_id })
  );

  let last_gallery_element = createLastGalleryElement();
	let providersGallery = createGallery([...randomProviders, last_gallery_element], 'square');
  let txtMsg = { text: `Here are some providers I found in Pennsylvania for Facelift` };
  let messages = [txtMsg, providersGallery];
  res.send({ messages });
}

router.get(
  '/', 
  handleRoute(searchServiceProviders, '[Error] Searching Service Providers')
);

router.get(
  '/:search_type', 
  handleRoute(getServiceProviders, '[Error] Searching Service Providers')
);

module.exports = router;