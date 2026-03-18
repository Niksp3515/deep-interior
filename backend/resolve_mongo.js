import dns from 'dns';
import fs from 'fs';

dns.setServers(['8.8.8.8']); // Use Google DNS to bypass local SRV blocks

dns.resolveSrv('_mongodb._tcp.cluster0.9vzvmj0.mongodb.net', (err, addresses) => {
  if (err) throw err;
  
  dns.resolveTxt('cluster0.9vzvmj0.mongodb.net', (err, txts) => {
    if (err) throw err;
    
    const hosts = addresses.map(a => `${a.name}:${a.port}`).join(',');
    const txtFields = txts.map(t => t.join('')).join('&');
    
    const uri = `mongodb://deepinterior:interior3515@${hosts}/?ssl=true&${txtFields}&appName=Cluster0`;
    
    let envContent = fs.readFileSync('.env', 'utf8');
    envContent = envContent.replace(/^MONGO_URI=.*$/m, `MONGO_URI=${uri}`);
    fs.writeFileSync('.env', envContent);
    console.log('Updated .env with resolved URI:\n' + uri);
  });
});
