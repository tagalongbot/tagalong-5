let { BASEURL, SERVICES_BASE_ID, SURGICAL_SERVICES_IMAGE_URL } = process.env;
let { createGallery } = require('../libs/bots');
let { shuffleArray } = require('../libs/helpers');

let { getTable, getAllDataFromTable } = require('../libs/data');

// Get Tables
let getServicesTable = getTable('Services');
let getServicesFromTable = getServicesTable(SERVICES_BASE_ID);

// Search Methods
let searchServices = async (surgical_or_non_surgical) => {
	let filterByFormula = `AND({Surgical / Non Surgical} = '${surgical_or_non_surgical}')`;
  let services = await getServicesFromTable({ filterByFormula });
  return services;
}

let toGalleryElement = ({ id: service_id, fields: service }) => {
  let surgical_or_non_surgical = service['Surgical / Non Surgical'];
  let non_surgical_category = service[`${surgical_or_non_surgical} Category`];

  let title = service['Name'].slice(0, 80);
  let subtitle = `${surgical_or_non_surgical} | ${non_surgical_category} | ${service[non_surgical_category]}`;
  let image_url = service['Image URL'];

  let btn1 = {
    title: 'View Service Details',
    type: 'json_plugin_url',
    url: `${BASEURL}/service/description?service_id=${service_id}`
  }

  let btn2 = {
    title: 'Find Providers',
    type: 'json_plugin_url',
    url: `${BASEURL}/service/providers?service_id=${service_id}`
  }

  let buttons = [btn1, btn2];

  let element = { title, subtitle, image_url, buttons};
  return element;
}

let getServices = async ({ query, params }, res) => {
  let first_name = query['first name'];

  let surgical_category_gallery_element = {
    title: 'Surgical Procedures',
    image_url: SURGICAL_SERVICES_IMAGE_URL,
    buttons: [{
      title: 'Learn More',
      type: 'json_plugin_url',
      web: `${BASEURL}/services/surgical`
    }]
  }

  
  let non_surgical_services = searchServices('Non Surgical');
  let non_surgical_services_gallery_data = non_surgical_services.map(toGalleryElement);
	let non_surgical_services_gallery = createGallery(non_surgical_services_gallery_data);

  let textMsg = { text: `Here's are some services you can search for ${first_name}` };
	let messages = [textMsg, surgical_category_gallery_element, non_surgical_services_gallery];
	res.send({ messages });
}

let handleErrors = (req, res) => (error) => {
  console.log(error);
	let source = 'airtable';
	res.send({ source, error });
}

module.exports = (req, res) => {
	getServices(req, res)

	.catch(
		handleErrors(req, res)
	);
}