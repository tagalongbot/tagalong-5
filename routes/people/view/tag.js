let { BASEURL, LOAD_MORE_IMAGE_URL } = process.env;

let { getPersonByMessengerID } = require('../../../libs/data/people.js');
let { createURL } = require('../../../libs/helpers/strings.js');
let { createBtn, createGallery } = require('../../../libs/bots.js');
let { getTagByID } = require('../../../libs/data/tags.js');

let toMatchGallery = (person) => {
  let is_person_verified = person.fields['Verified?'];

  let title = `${person.fields['First Name']} | Age: ${person.fields['Age']}`;
  let subtitle = `${person.fields['Gender']} | ${person.fields['City']} | ${person.fields['Country']}`;
  if (is_person_verified) subtitle = `Verified User ✅ | ${subtitle}`;

  let view_profile_url = createURL(
    `${BASEURL}/people/view/profile`,
    { tagged_person_messenger_id: person.fields['messenger user id'] }
  );

  let view_profile_btn = createBtn(
    `View Profile|web_url|${view_profile_url}`,
  );
  
  let message_btn = createBtn(
    `Message Me|web_url|${person.fields['Messenger Link']}`,
  );

  let buttons = [view_profile_btn, message_btn];

  return { title, subtitle, buttons };
}

let viewTag = async ({ query }, res) => {
  let { tag_id } = query;

  let tag = await getTagByID(tag_id);
  let tagged_person_name = tag.fields['Profile Name'];
  let tagged_person_messenger_user_id = tag.fields['Profile Messenger User ID'];

  let person = await getPersonByMessengerID(tagged_person_messenger_user_id);

  let gallery_data = [person].map(toMatchGallery);

  let gallery = createGallery(gallery_data, 'square');

  let txtMsg = { text: `Hey you've been matched with ${tagged_person_name}` };
  let messages = [txtMsg, gallery];
  res.send({ messages });
}

module.exports = viewTag;
