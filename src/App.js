import { useEffect, useState } from 'react';
import { getCountries, getReportByCountry } from './apis';
import CountrySelector from './components/CountrySelector';
import Highlight from './components/Highlight';
import Summary from './components/Summary';
import {sortBy} from 'lodash'
import moment from 'moment/moment';
import { Container, Typography } from '@material-ui/core';
import '@fontsource/roboto'

moment.locale('vi')

function App() {
  const [countries, setCountries] = useState([])
  const [selectedCountryId, setSelectedCountryId] = useState('')
  const [report, setReport] = useState([])

  useEffect(() => {
    getCountries()
      .then(res => {
        const countries = sortBy(res.data, 'Country');
        setCountries(countries);

        setSelectedCountryId('vn')
      })
  }, [])

  const handleOnChange = (e) => {
    setSelectedCountryId(e.target.value)
  }

  useEffect(() => {
    if (selectedCountryId) {
      const { Slug } = countries.find(
        (country) => country.ISO2.toLowerCase() === selectedCountryId
      )
      // call api
      getReportByCountry(Slug)
        .then((res) => {
          //xoa phan tu cuoi
          res.data.pop()
          setReport(res.data)
        })
    }
  }, [countries, selectedCountryId])
  return (
    <>
    <Container>
    <Typography variant="h2" component="h2">
      Số liệu thống kê COVID-19
    </Typography>
    <Typography>{moment().format('LLL')}</Typography>
      <CountrySelector countries={countries} handleOnChange={handleOnChange} value={selectedCountryId} />
      <Highlight report={report} />
      <Summary  selectedCountryId={selectedCountryId}  report={report} />
    </Container>
    </>
  );
}

export default App;
