let { BASEURL, PRACTICE_DATABASE_BASE_ID, SERVICES_BASE_ID } = process.env;
let { createGallery } = require('../libs/bots');
let { createURL } = require('../libs/helpers');
let { getTable, getAllDataFromTable, findTableData } = require('../libs/data');

let getPracticeTable = getTable('Practices');
let practiceTable = getPracticeTable(PRACTICE_DATABASE_BASE_ID);
let findPractice = findTableData(practiceTable);

let getServicesTable = getTable('Services');
let servicesTable = getServicesTable(SERVICES_BASE_ID);
let getServices = getAllDataFromTable(servicesTable);

let toGalleryElement = (provider_name) => ({ id: service_id, fields: service }) => {
  let title = service['Name'];
  let subtitle = `Service provided by ${provider_name}`.slice(0, 80);
  let image_url = service['Image URL'];

  let service_name = encodeURIComponent(service['Name']);
  let read_description_btn_url = createURL(`${BASEURL}/service/description/no`, { service_id, service_name });
  let btn1 = {
    title: 'Read Description',
    type: 'json_plugin_url',
    url: read_description_btn_url,
  }

  let buttons = [btn1];

  let element = { title, subtitle, image_url, buttons };
  return element;
}

let getProviderListOfServices = async ({ query }, res) => {
  let { provider_id, provider_name } = query;

  let provider = await findPractice(provider_id);
  let services = await getServices();

  let servicesFromProvider = services
    .filter((service) => provider.fields['Practice Services'].includes(service.fields['Name']));

  if (!servicesFromProvider[0]) {
    let redirect_to_blocks = ['No Provider Services Found'];
    res.send({ redirect_to_blocks });
    return;
  }

  let servicesGalleryData = servicesFromProvider.slice(0, 9).map(toGalleryElement(decodeURIComponent(provider_name)));
  let servicesGallery = createGallery(servicesGalleryData);
  let messages = [servicesGallery];
  res.send({ messages });
}

module.exports = getProviderListOfServices;