import http from 'k6/http'
import { describe, expect } from 'https://jslib.k6.io/k6chaijs/4.3.4.3/index.js';
import { Rate, Trend } from 'k6/metrics'

export const options = {
    vus: 10,
    // iterations:10,
    duration: '15s',
    
    thresholds: {
        http_req_failed: ['rate<0.001'], 
        http_req_duration: ['p(90)<10000'], 
        iterations: ['count < 30'], 
    },
}

const completedRate = new Rate('mobbi_completed_rate')
const completedRate1 = new Rate('mobbiCariMobil_completed_rate')
const mobbiAllduration = new Trend('mobbi_all_duration')
const cariMobilMoDuration = new Trend('mobbiCariMobil_all_duration')

export default function (){
    describe('test api dashboard mobbi', function() {
        const res = http.get('https://www.mobbi.id/',{
            tags: {judul: 'dashboard mobbi'}
        })
        const resCariMobil = http.get('https://www.mobbi.id/cari-mobil',{
            tags: {judul: 'cari mobil (Mobbi)'}
        })
        
        completedRate.add(res.status === 200)
        expect(res.status, 'status').to.equals(200)

        completedRate1.add(resCariMobil.status === 200)
        expect(resCariMobil.status, 'status cari-mobil').to.equals(200)
       

        mobbiAllduration.add(res.timings.duration)
        cariMobilMoDuration.add(resCariMobil.timings.duration)
    })
}
