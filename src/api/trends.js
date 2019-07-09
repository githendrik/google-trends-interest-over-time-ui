const trendsApi = require('google-trends-api');

async function getInterestOverTime(request, response) {
  const keyword = request.body.keyword;
  const rawStartDate = request.body.startDate.split('.');
  const rawEndDate = request.body.endDate.split('.');

  const startTime = new Date(Date.parse(`${rawStartDate[2]}-${rawStartDate[1]}-${rawStartDate[0]}`));
  const endTime = new Date(Date.parse(`${rawEndDate[2]}-${rawEndDate[1]}-${rawEndDate[0]}`));

  console.log(keyword);
  console.log(startTime);
  console.log(endTime);

  const trendsResponse = await trendsApi.interestOverTime({keyword, startTime, endTime, geo: 'US'});
  const trendsObject = JSON.parse(trendsResponse).default.timelineData.map((t) => ({ date: t.formattedTime, value: t.value[0] }));

  response.json(trendsObject);
}

async function getDummy(request, response) {
  response.json({ 'dummy': 'response' });
}

module.exports = {
  getInterestOverTime,
  getDummy
};
