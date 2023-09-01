# RESTful API


## Public


### Get leverage configuration

> **Request**

``` shell
curl 'https://api.orderly.org/v1/public/config/'
```

```java
```

```python
import requests

url = "https://api.orderly.org/v1/public/config"

payload={}
headers = {}

response = requests.request("GET", url, headers=headers, data=payload)
```

```javascript
var axios = require('axios');

var config = {
   method: 'get',
   url: 'https://api.orderly.org/v1/public/config',
   headers: {}
};

axios(config)
.then(function (response) {
   console.log(JSON.stringify(response.data));
})
.catch(function (error) {
   console.log(error);
});

```

**Limit: 10 requests per 1 second per IP address**

`GET v1/public/config`

> **Response**

```json
{
  "success": true,
  "data": {
    "available_futures_leverage": "1,2,3,4,5,10",
  },
  "timestamp": 1684811129040
}
```

**Parameters**

None


### System maintenance status

> **Request**

``` shell
curl 'https://api.orderly.org/v1/public/system_info/'
```

```java
```

```python
import requests

url = "https://api.orderly.org/v1/public/system_info"

payload={}
headers = {}

response = requests.request("GET", url, headers=headers, data=payload)
```

```javascript
var axios = require('axios');

var config = {
   method: 'get',
   url: 'https://api.orderly.org/v1/public/system_info',
   headers: {}
};

axios(config)
.then(function (response) {
   console.log(JSON.stringify(response.data));
})
.catch(function (error) {
   console.log(error);
});

```

**Limit: 10 requests per 1 second per IP address**

`GET v1/public/system_info`

Retreive the current system maintenance status of Orderly Network. A return value of status = 0 means the system is functioning properly and a return value of status = 2 means the system is under maintenance.

> **Response**

```json
{
    "success":true,
    "data":{
        "status": 0, // status = 2 means exchange is under maintenance
        "msg": "System is functioning properly."
    },
    "timestamp":1666567425831
}
```

**Parameters**

None


### Get Registration Nonce

> **Request**

``` shell
curl 'https://api-v2.orderly.org/v1/registration_nonce'
```

```java
```

```python
import requests

url = "https://api-v2.orderly.org/v1/registration_nonce"

payload={}
headers = {}

response = requests.request("GET", url, headers=headers, data=payload)
```

```javascript
var axios = require('axios');

var config = {
   method: 'get',
   url: 'https://api-v2.orderly.org/v1/registration_nonce',
   headers: {}
};

axios(config)
.then(function (response) {
   console.log(JSON.stringify(response.data));
})
.catch(function (error) {
   console.log(error);
});

```

**Limit: 10 requests per 1 second per IP address**

`GET /v1/registration_nonce`

Retrieve a nonce used for registering an account on Orderly Network. The validity of the nonce value is `2` minutes. Each nonce can only be used once (ie for one account).
> **Response**

```json
{
    "success": true,
    "data": {
        "registration_nonce": "194528949540"
    },
    "timestamp": 1688606744795
}
```

**Parameters**

None

### Get Account

> **Request**

``` shell
curl 'https://api-v2.orderly.org/v1/get_account?address=0xfcc17f2b240380d56f0615e8f654e4ae3cee8957&brokerId=woofi_dex'
```

```java
```

```python
import requests

url = "https://api-v2.orderly.org/v1/get_account"

payload={
    'address':'0xfcc17f2b240380d56f0615e8f654e4ae3cee8957',
    'brokerId':'woofi_dex'
}
headers = {}

response = requests.request("GET", url, headers=headers, data=payload)
```

```javascript
var axios = require('axios');

var config = {
   method: 'get',
   url: 'https://api-v2.orderly.org/v1/get_account?address=0xfcc17f2b240380d56f0615e8f654e4ae3cee8957&brokerId=woofi_dex',
   headers: {}
};

axios(config)
.then(function (response) {
   console.log(JSON.stringify(response.data));
})
.catch(function (error) {
   console.log(error);
});

```

**Limit: 10 requests per 1 second per IP address**

`GET /v1/get_account`

Retrieve a nonce used for registering an account on Orderly Network. The validity of the nonce value is `2` minutes. Each nonce can only be used once (ie for one account).
> **Response**

```json
{
    "success": true,
    "data": {
        "user_id": 24,
        "account_id": "0xb129e074a17dfba8d652ae1eca21c7d6bb6904f1aa693f4886d50db170933a46"
    },
    "timestamp": 1689146471412
}
```

**Parameters**

| Name     | Type   | Required | Description |
|----------|--------|----------| ----------- |
| address  | string | Y        | The address of the user wallet            |
| brokerId | string | Y        | The broker that the account is registered on            |


### Register Account

> **Request**

``` shell
curl -X POST '<https://api-v2.orderly.org/v1/register_account'>
    -H 'Content-Type: application/json' \
    -d '{ \
            "message": { \
              "brokerId": "woofi_dex", \
              "chainId": 80001, \
              "timestamp": 1685973017064, \
              "registrationNonce": "983740230482834645859323" \
            }, \
            "signature": "0xdfd9b9d8ede46dd6d12cd57a54fb83769dbec147701a7473f9abbd51d5206e380c18ecdc9134d491abc038a8dbb86783f4918558807e6ff32eb60bdd66f131de1b", \
            "userAddress": "0xb2eeefb3d6922c4270d174a4020d71d8bd23c229" \
        }' 
```

```java
```

```python
```

```javascript

```

**Limit: 10 requests per 1 second per IP address**

`POST /v1/register_account`

Registers a new account to Orderly Network. Note an account is unique for each wallet address + broker id (ie the same wallet address can have multiple accounts with Orderly Network, 1 with each broker)


> **Response**

```json
{
    "success":true,
    "data": {
        "account_id": "0x66e0e1adf0786e6a63a76c36c1138ec939bdf6c00e1672476ceb117a8c220841"
    },
    "timestamp": 1688606744795
}
```

**Parameters**

| Name                      | Type      | Required | Description |
|---------------------------|-----------|----------| ----------- |
| message                   | JSON      | Y        | Message object containing the message that is signed by the wallet owner            |
| message.brokerId          | string    | Y        | Broker ID, valid list can be found [here]            |
| message.chainId           | int       | Y        |  Chain ID of registering chain (within those that are supported by the Network)               |
| message.timestamp         | timestamp | Y        |  timestamp in UNIX milliseconds                                           |
| message.registrationNonce |  string         | Y        | Valid nonce from <Get Registration Nonce>         |
| signature                 | string          | Y        | The signature generated by signing the message object via EIP-712     |
| userAddress               | string          | Y        |  The address of the wallet signing the message object via EIP-712       |


### Get Orderly Key

> **Request**

``` shell
curl '<https://api-v2.orderly.org/v1/get_orderly_key?accountId=0xb129e074a17dfba8d652ae1eca21c7d6bb6904f1aa693f4886d50db170933a46&orderlyKey=ed25519:7tEoJo5hMBKBrQsqmc8yw1xNfoQCFQBVwQT1eFafRNRf'>
```

```java
```

```python
```

```javascript

```

**Limit: 10 requests per 1 second per IP address**

`GET /v1/get_orderly_key`

Check the validity of an Orderly access key attached to the account.

> **Response**

```json
{
    "success": true,
    "data": {
        "orderly_key": "ed25519:7tEoJo5hMBKBrQsqmc8yw1xNfoQCFQBVwQT1eFafRNRf",
        "scope": "read,trading",
        "expiration": 1689086651947
    },
    "timestamp": 1689146723102
}
```

**Parameters**

| Name       | Type      | Required | Description |
|------------|-----------|----------| ----------- |
| accountId  | string      | Y        | The account id of the user         |
| orderlyKey | string    | Y        | The public key of the Orderly access key        |


### Add Orderly Key

> **Request**

``` shell
curl -X POST '<https://api-v2.orderly.org/v1/add_orderly_key'>
    -H 'Content-Type: application/json' \
    -d '{ \
        "message": { \
            "brokerId": "woofi_dex", \
            "chainId": 1, \
            "orderlyKey": "ed25519:3qEZbVQ9NvknYxMWdrpjrrXyJgo2d2hH4dEBUzGdCrE4", \
            "scope": "read,trading", \
            "timestamp": 1688559313253, \
            "expiration": 0 \
        }, \
        "signature": "0x1c8646ded35532f1a3b616c39071e95143519bd5883b76d06c80fcdefda2c26748d3e992a0a33c9c3c350f816e75c1efc548c83dbffab0f67e8138fcb6f7ea681c", \
        "userAddress": "0xc7ef8c0853ccb92232aa158b2af3e364f1bae9a1" \
    }'
```

```java
```

```python
```

```javascript

```

**Limit: 10 requests per 1 second per IP address**

`POST /v1/add_orderly_key`

Adds an Orderly access key to an account.

> **Response**

```json
{
    "success":true,
    "data": {
        "orderly_key": "ed25519:FRXntsPJBCy6dzKv9WPw4eYSw3rKU9Npz3T6UmvvJc9Z"
    }
}
```

**Parameters**

| Name               | Type      | Required | Description                                                                                        |
|--------------------|-----------|----------|----------------------------------------------------------------------------------------------------|
| message            | JSON      | Y        | Message object containing the message that is signed by the wallet owner                           |
| message.brokerId   | string    | Y        | Broker ID, valid list can be found [here]                                                          |
| message.chainId    | int       | Y        | Chain ID of registering chain (within those that are supported by the Network)                     |
| message.orderlyKey | timestamp | Y        | timestamp in UNIX milliseconds                                                                     |
| message.scope      |  string         | Y        | Valid nonce from <Get Registration Nonce>                                                          |
| message.timestamp  | timestamp                | Y        | Expiration time of the key in UNIX milliseconds. Maximum allowed expiration is [365 days] from add |
| message.expiration | timestamp                | Y        | The signature generated by signing the message object via EIP-712                                               |
| signature          | string          | Y        | The signature generated by signing the message object via EIP-712                                  |
| userAddress        | string          | Y        | The address of the wallet signing the message object via EIP-712                                   |



### Exchange information 

> **Request**

``` shell
curl 'https://api.orderly.org/v1/public/info/PERP_BTC_USDC'
```

```java
```

```python
import requests

url = "https://api.orderly.org/v1/public/info/PERP_BTC_USDC"

payload={}
headers = {}

response = requests.request("GET", url, headers=headers, data=payload)
```

```javascript
var axios = require('axios');

var config = {
   method: 'get',
   url: 'https://api.orderly.org/v1/info/PERP_BTC_USDC',
   headers: {}
};

axios(config)
.then(function (response) {
   console.log(JSON.stringify(response.data));
})
.catch(function (error) {
   console.log(error);
});

```

**Limit: 10 requests per 1 second per IP address**

`GET /v1/public/info/:symbol`

This endpoint provides all the values for the rules that an order need to fulfil in order for it to be placed successfully. The rules are defined as follows:

Price filter

- `price` >= `quote_min`
- `price` <= `quote_max`
- `(price - quote_min) % quote_tick` should equal to zero
- `price` <= `asks[0].price * (1 + price_range)` when BUY
- `price` >= `bids[0].price * (1 - price_range)` when SELL

Size filter

- `base_min` <= `quantity` <= `base_max`
- `(quantity - base_min) % base_tick` should equal to zero

Min Notional filter

- `price * quantity` should greater than `min_notional`

Risk Exposure filer

- Order size should be within holding threshold. See [account_info](#get-account-information)

> **Response**

```json
{
   "success":true,
   "data":{
      "symbol":"PERP_BTC_USDC",
      "quote_min":0,
      "quote_max":100000,
      "quote_tick":0.1,
      "base_min":0.00001,
      "base_max":20,
      "base_tick":0.00001,
      "min_notional":1,
      "price_range":0.02,
      "price_scope":0.4,
      "std_liquidation_fee":0.03,
      "liquidator_fee":0.015,
      "claim_insurance_fund_discount":0.0075,
      "funding_period":8,
      "cap_funding":0.000375,
      "floor_funding":-0.000375,
      "interest_rate":0.0001,
      "created_time":1684140107326,
      "updated_time":1685345968053,
      "imr_factor":0.0000002512,
      "base_mmr":0.05,
      "base_imr":0.1
   },
   "timestamp":1685598448497
}
```

**Parameters**

| Name   | Type   | Required | Description |
| ------ | ------ | -------- | ----------- |
| symbol | string | Y        |             |

### Token info

> **Request**

``` shell
curl 'https://api.orderly.org/v1/public/token'
```
```java
```

```python
import requests

url = "https://api.orderly.org/v1/public/token"

payload={}
headers = {}

response = requests.request("GET", url, headers=headers, data=payload)
```

```javascript
var axios = require('axios');

var config = {
   method: 'get',
   url: 'https://api.orderly.org/v1/public/token',
   headers: {}
};

axios(config)
.then(function (response) {
   console.log(JSON.stringify(response.data));
})
.catch(function (error) {
   console.log(error);
});

```

**Limit: 10 requests per 1 second per IP address**

`GET /v1/public/token`

Retrives the available tokens to custody within Orderly Network.

> **Response**

```json
{
    "success":true,
    "data":{
        "rows":[
            {
                "token": "NEAR", // name of token
                "token_account_id": "near", // token account address on NEAR chain
                "decimals": 24, // precision of the token
                "minimum_increment": 0.00000001 // minimum increment of the token on Orderly
            },
            ...
        ]
    }
    "timestamp":1663160261906
}
```

**Parameters**

None

### Available symbols

> **Request**

``` shell
curl 'https://api.orderly.org/v1/public/info'
```

```java
```

```python
import requests

url = "https://api.orderly.org/v1/public/info"

payload={}
headers = {}

response = requests.request("GET", url, headers=headers, data=payload)
```

```javascript
var axios = require('axios');

var config = {
   method: 'get',
   url: 'https://api.orderly.org/v1/public/info',
   headers: {}
};

axios(config)
.then(function (response) {
   console.log(JSON.stringify(response.data));
})
.catch(function (error) {
   console.log(error);
});
```

**Limit: 10 requests per 1 second per IP address**

`GET /v1/public/info`

Get available symbols that Orderly Network supports, and also send order rules for each symbol. The definition of rules can be found at [Exchange Infomation](#exchange-information)

> **Response**

```json
{
   "success":true,
   "data":{
      "rows":[
         {
            "symbol":"PERP_BTC_USDC",
            "quote_min":0,
            "quote_max":100000,
            "quote_tick":0.1,
            "base_min":0.00001,
            "base_max":20,
            "base_tick":0.00001,
            "min_notional":1,
            "price_range":0.02,
            "price_scope":0.4,
            "std_liquidation_fee":0.03,
            "liquidator_fee":0.015,
            "claim_insurance_fund_discount":0.0075,
            "funding_period":8,
            "cap_funding":0.000375,
            "floor_funding":-0.000375,
            "interest_rate":0.0001,
            "created_time":1684140107326,
            "updated_time":1685345968053,
            "imr_factor":0.0000002512,
            "base_mmr":0.05,
            "base_imr":0.1
         },
         ...
      ]
   },
   "timestamp":1685590894341
}
```

**Parameters**

None

### Fee information

> **Request**

``` shell
curl 'https://api.orderly.org/v1/public/fee/program'
```

```java
```

```python
import requests

url = "https://api.orderly.org/v1/fee/program"

payload={}
headers = {}

response = requests.request("GET", url, headers=headers, data=payload)
```

```javascript
var axios = require('axios');

var config = {
   method: 'get',
   url: 'https://api.orderly.org/v1/fee/program',
   headers: {}
};

axios(config)
.then(function (response) {
   console.log(JSON.stringify(response.data));
})
.catch(function (error) {
   console.log(error);
});
```

**Limit: 10 requests per 1 second per IP address**

`GET /v1/public/fee/program`

Get the current Orderly Network fee structure.

> **Response**

```json
{
    "success": true,
    "data": {
        "rows": [
            {
                "tier": "1",
                "maker_fee": "0.1%",
                "taker_fee": "0.1%",
                "volume_min": 0, // minimum 30-day volume (in USDC) required for eligibility of this tier
                "volume_max": 500000
            },
            {
                "tier": "2",
                "maker_fee": "0.08%",
                "taker_fee": "0.09%",
                "volume_min": 500000,
                "volume_max": 3000000
            },
            {
                "tier": "3",
                "maker_fee": "0.06%",
                "taker_fee": "0.08%",
                "volume_min": 3000000,
                "volume_max": 10000000
            },
            {
                "tier": "4",
                "maker_fee": "0.04%",
                "taker_fee": "0.07%",
                "volume_min": 10000000,
                "volume_max": 50000000
            },
            {
                "tier": "5",
                "maker_fee": "0.02%",
                "taker_fee": "0.06%",
                "volume_min": 50000000,
                "volume_max": 100000000
            },
            {
                "tier": "6",
                "maker_fee": "0%",
                "taker_fee": "0.05%",
                "volume_min": 100000000,
                "volume_max": null
            }
        ]
    },
    "timestamp": 1661851272691
}
```

**Parameters**

None


### Futures fee information

> **Request**

```shell
curl 'https://api.orderly.org/v1/public/fee_futures/program'
```
```java
```
```python
import requests

url = "https://api.orderly.org/v1/public/fee_futures/program"

payload={}
headers = {}
response = requests.request("GET", url, headers=headers, data=payload)
```
```javascript
var axios = require('axios');

var config = {
   method: 'get',
   url: 'https://api.orderly.org/v1/public/fee_futures/program',
   headers: {}
};

axios(config)
.then(function (response) {
   console.log(JSON.stringify(response.data));
})
.catch(function (error) {
   console.log(error);
});

```

**Limit: 10 requests per 1 second per IP address**

`GET /v1/public/fee_futures/program`

Get fee information for futures trading.

> **Response**

```json
{
   "success":true,
   "data":{
      "rows":[
         {
            "tier":"1",
            "maker_fee":"0.04%",
            "taker_fee":"0.08%",
            "volume_min":0,
            "volume_max":2500000
         },
         {
            "tier":"2",
            "maker_fee":"0.036%",
            "taker_fee":"0.075%",
            "volume_min":2500000,
            "volume_max":15000000
         },
         {
            "tier":"3",
            "maker_fee":"0.032%",
            "taker_fee":"0.07%",
            "volume_min":15000000,
            "volume_max":50000000
         },
         {
            "tier":"4",
            "maker_fee":"0.02%",
            "taker_fee":"0.06%",
            "volume_min":50000000,
            "volume_max":250000000
         },
         {
            "tier":"5",
            "maker_fee":"0.012%",
            "taker_fee":"0.05%",
            "volume_min":250000000,
            "volume_max":500000000
         },
         {
            "tier":"6",
            "maker_fee":"0.008%",
            "taker_fee":"0.04%",
            "volume_min":500000000,
            "volume_max":null
         }
      ]
   },
   "timestamp":1682240064771
}
```

**Parameters**

None


### Market trades

> **Request**

```shell
curl 'https://api.orderly.org/v1/public/market_trades?symbol=SPOT_ETH_USDC&limit=10'
```
```java
```
```python
import requests

url = "https://api.orderly.org/v1/public/market_trades?symbol=SPOT_ETH_USDC&limit=10"

payload={}
headers = {}

response = requests.request("GET", url, headers=headers, data=payload)

print(response.text)

```
```javascript
var axios = require('axios');

var config = {
   method: 'get',
   url: 'https://api.orderly.org/v1/public/market_trades?symbol=SPOT_ETH_USDC&limit=10',
   headers: {}
};

axios(config)
.then(function (response) {
   console.log(JSON.stringify(response.data));
})
.catch(function (error) {
   console.log(error);
});

```

**Limit: 10 requests per 1 second per IP address**

`GET /v1/public/market_trades`

Get the latest market trades.

> **Response**

```js
{
    "success": true,
    "data": {
       "rows": [
        {
            "symbol": "SPOT_ETH_USDC",
            "side": "BUY",
            "executed_price": 202,
            "executed_quantity": 0.00025,
            "executed_timestamp": 1567411795000 // Unix epoch time in milliseconds
        },
        // ...
     ]
    },
    "timestamp": 1663313562090
}
```

**Parameters**

| Name   | Type   | Required        | Description                      |
| ------ | ------ | --------------- | -------------------------------- |
| symbol | string | Y               |                                  |
| limit  | number | N (default: 10) | Numbers of trades want to query. |

### Volume statistics

> **Request**

``` curl
curl 'https://api.orderly.org/v1/public/volume/stats'
```

```java
```

```python
import requests

url = "https://api.orderly.org/v1/public/volume/stats"

payload={}
headers = {}

response = requests.request("GET", url, headers=headers, data=payload)
```

```javascript
var axios = require('axios');

var config = {
   method: 'get',
   url: 'https://api.orderly.org/v1/public/volume/stats',
   headers: {}
};

axios(config)
.then(function (response) {
   console.log(JSON.stringify(response.data));
})
.catch(function (error) {
   console.log(error);
});
```

**Limit: 10 requests per 1 second per IP address**

`GET /v1/public/volume/stats`

Get the latest volume statistics of Orderly and its associated brokers. Note that for broker volume, the volume is counted as the sum of the maker and taker volume, while for the full Orderly platform, the volume is the total amount matched on the platform (ie taker and maker are not double-counted.)

> **Response**

```json
{
    "success": true, 
    "data": [
        {
            "spot_volume_ytd":1312.9,
            "perp_volume_ytd":274148.0364,
            "spot_volume_ltd":1212.91,
            "perp_volume_ltd":274148.0364,
            "spot_volume_last_7_days":0,
            "perp_volume_last_7_days":120272.7674,
            "spot_volume_last_30_days":899.74,
            "perp_volume_last_30_days":300730.5454
        }
    ],
    "timestamp": 1580794149000
}
```

**Parameters**

| Name      | Type   | Required        | Description                                                                                       |
| --------- | ------ | --------------- | ------------------------------------------------------------------------------------------------- |
| broker_id | string | N               | If provided, statistics will be regarding the particular broker rather than the Orderly platform. |

### Get list of brokers

> **Request**

``` curl
curl 'https://api.orderly.org/v1/public/broker/name'
```
```java
```

```python
import requests

url = "https://api.orderly.org/v1/public/broker/name"

payload={}
headers = {}

response = requests.request("GET", url, headers=headers, data=payload)
```

```javascript
var axios = require('axios');

var config = {
   method: 'get',
   url: 'https://api.orderly.org/v1/public/broker/name',
   headers: {}
};

axios(config)
.then(function (response) {
   console.log(JSON.stringify(response.data));
})
.catch(function (error) {
   console.log(error);
});
```


**Limit: 10 requests per 1 second per IP address**

`GET /v1/public/broker/name?broker_id=:broker_id`

Get the list of brokers currently onboarded on Orderly Network.

> **Response**

```json
{
    "success": true,
    "data":[
        "rows":[
            {
                "broker_id": "broker_1",
                "broker_name": "Broker One"
            },
            {
                "broker_id": "broker_2",
                "broker_name": "Broker Two"
            }
        ]
    ],
    "timestamp": 1580794149000
}
```

**Parameters**

| Name      | Type   | Required   | Description                                                         |
| --------- | ------ | ---------- | ------------------------------------------------------------------- |
| broker_id | string | N          | If provided, it will only output details for the particular broker. |

### Get predicted funding rate for all markets

> **Request**

```shell
curl 'https://api.orderly.org/v1/public/funding_rates'
```

```java
```

```python
import requests

url = "https://api.orderly.org/v1/public/funding_rates"

payload={}
headers = {}

response = requests.request("GET", url, headers=headers, data=payload)

```

```javascript
var axios = require('axios');

var config = {
   method: 'get',
   url: 'https://api.orderly.org/v1/public/funding_rates',
   headers: {}
};

axios(config)
.then(function (response) {
   console.log(JSON.stringify(response.data));
})
.catch(function (error) {
   console.log(error);
});

```

**Limit: 10 requests per 1 second per IP address**

`GET /v1/public/funding_rates`

Get predicted funding rates for all futures trading pairs.

Get the : 
* `last_funding_rate` : latest hourly funding rate for all the markets for the last funding period (dt = 8h)
* `est_funding_rate` : rolling average of all funding rates over the last 8 hours 
> **Response**

```json
{
    "success": true,
    "data": {
        "rows": [
            {
                "symbol": "PERP_ETH_USDC",
                "est_funding_rate": 0,
                "est_funding_rate_timestamp": 1683879975000,
                "last_funding_rate": 0.0001,
                "last_funding_rate_timestamp": 1683878400000,
                "next_funding_time": 1683907200000,
                "sum_unitary_funding": 521.367
            },
            {
                "symbol": "PERP_NEAR_USDC",
                "est_funding_rate": 0.02651942,
                "est_funding_rate_timestamp": 1683879975000,
                "last_funding_rate": 0.0075,
                "last_funding_rate_timestamp": 1683878400000,
                "next_funding_time": 1683907200000,
                "sum_unitary_funding": -6.167009
            }
        ]
    },
    "timestamp": 1683879989454
}
```

**Parameters**

None

### Get predicted funding rate for one market

> **Request**

```shell
curl 'https://api.orderly.org/v1/public/funding_rate/PERP_ETH_USDC'
```

```java
```

```python
import requests

url = "https://api.orderly.org/v1/public/funding_rate/PERP_ETH_USDC"

payload={}
headers = {}

response = requests.request("GET", url, headers=headers, data=payload)

```

```javascript
var axios = require('axios');

var config = {
   method: 'get',
   url: 'https://api.orderly.org/v1/public/funding_rate/PERP_ETH_USDC',
   headers: {}
};

axios(config)
.then(function (response) {
   console.log(JSON.stringify(response.data));
})
.catch(function (error) {
   console.log(error);
});

```

**Limit: 10 requests per 1 second per IP address**

`GET /v1/public/funding_rate/:symbol`

Get latest funding rate for one market.

> **Response**

```json
{
  "success": true,
  "data": {
    "symbol": "PERP_ETH_USDC",
    "est_funding_rate": 0,
    "est_funding_rate_timestamp": 1683880020000,
    "last_funding_rate": 0.0001,
    "last_funding_rate_timestamp": 1683878400000,
    "next_funding_time": 1683907200000,
    "sum_unitary_funding": 521.367
  },
  "timestamp": 1683880025278
}
```

**Parameters**

| Name      | Type   | Required   | Description                                                         |Param Type  |
| --------- | ------ | ---------- | ------------------------------------------------------------------- |------------|
| symbol    | string | Y          |                                                                     |Path        |

### Get funding rate history for one market


> **Request**


```shell

curl 'https://api.orderly.org/v1/public/funding_rate_history?symbol=PERP_ETH_USDC&page=1&size=5'

```

```java

```

```python
import requests

url = "https://api.orderly.org/v1/public/funding_rate_history?symbol=PERP_ETH_USDC&page=1&size=5"

payload={}
headers = {}

response = requests.request("GET", url, headers=headers, data=payload)
```

```javascript
var axios = require('axios');

var config = {
   method: 'get',
   url: 'https://api.orderly.org/v1/public/funding_rate_history?symbol=PERP_ETH_USDC&page=1&size=5',
   headers: {}
};

axios(config)
.then(function (response) {
   console.log(JSON.stringify(response.data));
})
.catch(function (error) {
   console.log(error);
});
```

**Limit: 10 requests per 1 second per IP address**


`GET /v1/public/funding_rate_history`


Get funding rate history for one market.


> **Response**


```json

{
   "data":{
      "meta":{
         "current_page":1,
         "records_per_page":5,
         "total":13
      },
      "rows":[
         {
            "funding_rate":0.0001,
            "funding_rate_timestamp":1684224000000,
            "next_funding_time":1684252800000,
            "symbol":"PERP_ETH_USDC"
         },
         {
            "funding_rate":0.0001,
            "funding_rate_timestamp":1684195200000,
            "next_funding_time":1684224000000,
            "symbol":"PERP_ETH_USDC"
         },
        ...
      ]
   },
   "success":true,
   "timestamp":1684232331309
}

```


**Parameters**


| Name      | Type      | Required      | Description                                                                                 |
| ----------|-----------|---------------|---------------------------------------------------------------------------------------------|
| symbol    | string    | Y             |                                                                                             |
| start_t   | timestamp | N             |start time range that you wish to query, noted that the time stamp is a 13-digits timestamp. |
| end_t     | timestamp | N             |end time range that you wish to query, noted that the time stamp is a 13-digits timestamp.   |
| page      | number    | N(default: 1) |the page you wish to query.                                                                  |
| size      | number    | N             |Default: 60                                                                                  |


### Get futures info for all markets

> **Request**

```shell
curl 'https://api.orderly.org/v1/public/futures'
```

```java

```

```python
import requests

url = "https://api.orderly.org/v1/public/futures"

payload={}
headers = {}

response = requests.request("GET", url, headers=headers, data=payload)
```

```javascript
var axios = require('axios');

var config = {
   method: 'get',
   url: 'https://api.orderly.org/v1/public/futures',
   headers: {}
};

axios(config)
.then(function (response) {
   console.log(JSON.stringify(response.data));
})
.catch(function (error) {
   console.log(error);
});

```

**Limit: 10 requests per 1 second per IP address**

`GET /v1/public/futures`

Get basic futures information for all the markets.

> **Response**

```json
{
   "success":true,
   "data":{
      "rows":[
         {
            "symbol":"PERP_ETH_USDC",
            "index_price":1901.6,
            "mark_price":1950.0,
            "sum_unitary_funding":387.891,
            "est_funding_rate":0.00046875,
            "last_funding_rate":0.00046875,
            "next_funding_time":1683270060000,
            "open_interest":"None",
            "24h_open":2115.0,
            "24h_close":2115.0,
            "24h_high":2115.0,
            "24h_low":2115.0,
            "24h_volumn":0.0,
            "24h_amount":0.0
         },
         {
            "symbol":"PERP_NEAR_USDC",
            "index_price":1.8504,
            "mark_price":2.05,
            "sum_unitary_funding":-6.373816,
            "est_funding_rate":0.0009375,
            "last_funding_rate":0.0009375,
            "next_funding_time":1683270060000,
            "open_interest":"None",
            "24h_open":1.9,
            "24h_close":1.9,
            "24h_high":1.9,
            "24h_low":1.895,
            "24h_volumn":3668.3,
            "24h_amount":6967.76
         }
      ]
   },
   "timestamp":1683270033049
}
```

**Parameters**

None                   

### Get futures for one market

> **Request**

```shell
curl 'https://api.orderly.org/v1/public/futures/PERP_ETH_USDC'
```

```java
```

```python
import requests

url = "https://api.orderly.org/v1/public/futures/PERP_ETH_USDC"

payload={}
headers = {}

response = requests.request("GET", url, headers=headers, data=payload)

```

```javascript
var axios = require('axios');

var config = {
   method: 'get',
   url: 'https://api.orderly.org/v1/public/futures/PERP_ETH_USDC',
   headers: {}
};

axios(config)
.then(function (response) {
   console.log(JSON.stringify(response.data));
})
.catch(function (error) {
   console.log(error);
});

```

**Limit: 10 requests per 1 second per IP address**

`GET /v1/public/futures/:symbol`

Get basic futures information for one market.

> **Response**

```json
{
   "success":true,
   "data":{
      "symbol":"PERP_ETH_USDC",
      "index_price":1903.8,
      "mark_price":1950.0,
      "sum_unitary_funding":387.936,
      "est_funding_rate":0.00046875,
      "last_funding_rate":0.00046875,
      "next_funding_time":1683270240000,
      "open_interest":"None",
      "24h_open":2115.0,
      "24h_close":2115.0,
      "24h_high":2115.0,
      "24h_low":2115.0,
      "24h_volumn":0.0,
      "24h_amount":0.0
   },
   "timestamp":1683270228845
}
```

**Parameters**

| Name      | Type   | Required   | Description                                                         |
| --------- | ------ | ---------- | ------------------------------------------------------------------- |
| symbol    | string | Y          |                                                                     |

### Get positions under liquidation

> **Request**

```shell
curl 'https://api.orderly.org/v1/public/liquidation'
```
```java
```
```python
import requests

url = "https://api.orderly.org/v1/public/liquidation"

payload={}
headers = {}

response = requests.request("GET", url, headers=headers, data=payload)
```

```javascript
var axios = require('axios');

var config = {
   method: 'get',
   url: 'https://api.orderly.org/v1/public/liquidation',
   headers: {}
};

axios(config)
.then(function (response) {
   console.log(JSON.stringify(response.data));
})
.catch(function (error) {
   console.log(error);
});

```

**Limit: 10 requests per 1 second per IP address**

`GET /v1/public/liquidation`

> **Response**

```json
{
   "success":true,
   "data":{
      "rows":[
         {
            "timestamp":1685298157704,
            "type":"liquidated",
            "liquidation_id":1730,
            "positions_by_perp":[
               {
                  "symbol":"PERP_BTC_USDC",
                  "position_qty":-0.22457,
                  "liquidator_fee":0.015
               },
              ...
            ]
         },
        ...
      ],
      "meta":{
         "total":20,
         "records_per_page":25,
         "current_page":1
      }
   },
   "timestamp":1685453109700
}
```

**Parameters**

| Name      | Type      | Required      | Description                                                                                 |
| --------- | ------    | ----------    | -------------------------------------------------------------------                         |
| start_t   | timestamp | N             |start time range that you wish to query, noted that the time stamp is a 13-digits timestamp. |
| end_t     | timestamp | N             |end time range that you wish to query, noted that the time stamp is a 13-digits timestamp.   |
| page      | number    | N(default: 1) |the page you wish to query.                                                                  |
| size      | number    | N             |Default: 60                                                                                  |


### Get liquidated positions info

> **Request**

```shell
curl 'https://api.orderly.org/v1/public/liquidated_positions?symbol=PERP_ETH_USDC'
```
```java
```
```python
import requests

url = "https://api.orderly.org/v1/public/liquidated_positions?symbol=PERP_ETH_USDC"

payload={}
headers = {}

response = requests.request("GET", url, headers=headers, data=payload)
```
```javascript
var axios = require('axios');

var config = {
   method: 'get',
   url: 'https://api.orderly.org/v1/public/liquidated_positions?symbol=PERP_ETH_USDC',
   headers: {}
};

axios(config)
.then(function (response) {
   console.log(JSON.stringify(response.data));
})
.catch(function (error) {
   console.log(error);
});

```

**Limit: 10 requests per 1 second per IP address**

`GET /v1/public/liquidated_positions`


> **Response**

```json
{
    "success": true,
    "data": {
        "rows": [
            {
                "timestamp": 1683802462092,
                "liquidation_id": 29,
                "transfer_amount_to_insurance_fund": 0,
                "type": "liquidated",
                "positions_by_perp": [
                    {
                        "symbol": "PERP_ETH_USDC",
                        "position_qty": 0,
                        "liquidator_fee": 0.015,
                        "cost_position_transfer": 0,
                        "transfer_price": 1860,
                        "insurance_fund_fee": 0.011999,
                        "abs_liquidator_fee": 0,
                        "abs_insurance_fund_fee": 0
                    },
                    ...
                ]
            },
            ...
        ],
        "meta": {
            "total": 9,
            "records_per_page": 25,
            "current_page": 1
        }
    },
    "timestamp": 1683881314470
}
```

**Parameters**

| Name      | Type      | Required      | Description                                                                                 |
| ----------|-----------|---------------|---------------------------------------------------------------------------------------------|
| symbol    | string    | Y             |                                                                                             |
| start_t   | timestamp | N             |start time range that you wish to query, noted that the time stamp is a 13-digits timestamp. |
| end_t     | timestamp | N             |end time range that you wish to query, noted that the time stamp is a 13-digits timestamp.   |
| page      | number    | N(default: 1) |the page you wish to query.                                                                  |
| size      | number    | N             |Default: 60                                                                                  |


### Get insurance fund info

> **Request**

```shell
curl 'https://api.orderly.org/v1/public/insurancefund'
```
```java
```
```python
import requests

url = "https://api.orderly.org/v1/public/insurancefund"

payload={}
headers = {}

response = requests.request("GET", url, headers=headers, data=payload)
```
```javascript
var axios = require('axios');

var config = {
   method: 'get',
   url: 'https://api.orderly.org/v1/public/insurancefund',
   headers: {}
};

axios(config)
.then(function (response) {
   console.log(JSON.stringify(response.data));
})
.catch(function (error) {
   console.log(error);
});

```

**Limit: 10 requests per 1 second per IP address**

`GET /v1/public/insurancefund`


> **Response**

```json
{
   "success":true,
   "data":{
      "rows":[
         {
            "symbol":"PERP_BTC_USDC",
            "timestamp":1685262631606,
            "position_qty":0,
            "cost_position":-617.672835,
            "last_sum_unitary_funding":100.56,
            "settle_price":0,
            "average_open_price":0,
            "pnl_24_h":0,
            "fee_24_h":0,
            "mark_price":27821.8
         },
        ...
      ],
      "min_insurance_fund_initial_margin_ratio":0.3,
      "min_insurance_fund_margin_ratio":0.25,
      "margin_ratio":10,
      "total_collateral_value":10008662.996861,
      "balance":10001908.678983,
      "free_collateral":10008662.996861,
      "total_account_value":10008662.996861,
      "total_pnl_24_h":0
   },
   "timestamp":1685439471395
}
```

**Parameters**
None


### Get Campaigns

> **Request**

```shell
curl 'https://api.orderly.org/v1/public/campaigns'
```
```java
```
```python
import requests

url = "https://api.orderly.org/v1/public/campaigns"

payload={}
headers = {}

response = requests.request("GET", url, headers=headers, data=payload)
```
```javascript
var axios = require('axios');

var config = {
   method: 'get',
   url: 'https://api.orderly.org/v1/public/campaigns',
   headers: {}
};

axios(config)
.then(function (response) {
   console.log(JSON.stringify(response.data));
})
.catch(function (error) {
   console.log(error);
});

```

**Limit: 10 requests per 1 second per IP address**

`GET /v1/public/campaigns`


> **Response**

```json
{
    "success": true,
    "data": {
        "rows": [
            {
                "id": 2,
                "name": "campaign_20230807",
                "start_time": 1575014255089,
                "end_time": 1585014255089
            },
            {
                "id": 1,
                "name": "campaign_20230806",
                "start_time": 1575014255089,
                "end_time": 1585014255089
            },
        ]
    },
    "timestamp": 1688371971557
}
```

**Parameters**

| Name            | Type      | Required | Description                                                                                 |
|-----------------|-----------|----------|---------------------------------------------------------------------------------------------|
| only_show_alive | boolean   | N        |                                                                                             |
| start_t         | timestamp | N        |start time range that you wish to query, noted that the time stamp is a 13-digits timestamp. |
| end_t           | timestamp | N        |end time range that you wish to query, noted that the time stamp is a 13-digits timestamp.   |



### Get Campaign Statistics

> **Request**

```shell
curl 'https://api.orderly.org/v1/public/campaign/stats'
```
```java
```
```python
import requests

url = "https://api.orderly.org/v1/public/campaign/stats"

payload={}
headers = {}

response = requests.request("GET", url, headers=headers, data=payload)
```
```javascript
var axios = require('axios');

var config = {
   method: 'get',
   url: 'https://api.orderly.org/v1/public/campaign/stats',
   headers: {}
};

axios(config)
.then(function (response) {
   console.log(JSON.stringify(response.data));
})
.catch(function (error) {
   console.log(error);
});

```

**Limit: 10 requests per 1 second per IP address**

`GET /v1/public/campaign/stats`


> **Response**

```json
{
    "success": true,
    "data": {
        "volume": 1000.12,
        "user_count": 10,
    	"updated_time": 1688371971550
    },
    "timestamp": 1688371971557
}
```

**Parameters**

| Name      | Type      | Required | Description                                                                                 |
|-----------|-----------|----------|---------------------------------------------------------------------------------------------|
| broker_id | string    | N        |                                                                                             |
| symbol    | string    | N        | |


### Get Campaign Details

> **Request**

```shell
curl 'https://api.orderly.org/v1/public/campaign/stats/details?campaign_id=1'
```
```java
```
```python
import requests

url = "https://api.orderly.org/v1/public/campaign/stats/details?campaign_id=1"

payload={}
headers = {}

response = requests.request("GET", url, headers=headers, data=payload)
```
```javascript
var axios = require('axios');

var config = {
   method: 'get',
   url: 'https://api.orderly.org/v1/public/campaign/stats/details?campaign_id=1',
   headers: {}
};

axios(config)
.then(function (response) {
   console.log(JSON.stringify(response.data));
})
.catch(function (error) {
   console.log(error);
});

```

**Limit: 10 requests per 1 second per IP address**

`GET /v1/public/campaign/stats/details`


> **Response**

```json
{
    "success": true,
    "data": {
        "rows": [
            {
		    	"broker_id": "ref_dex",
		    	"symbol": "PERP_BTC_USDC",
		        "volume": 1000.12,
		        "user_count": 10
		    },
            {
		    	"broker_id": "ref_dex",
		    	"symbol": "PERP_NEAR_USDC",
		        "volume": 1000.12,
		        "user_count": 10
		    },
            {
		    	"broker_id": "woofi_dex",
		    	"symbol": "PERP_BTC_USDC",
		        "volume": 1000.12,
		        "user_count": 10
		    },
            {
		    	"broker_id": "woofi_dex",
		    	"symbol": "PERP_NEAR_USDC",
		        "volume": 1000.12,
		        "user_count": 10
		    },
            {
		    	"broker_id": null,
		    	"symbol": "PERP_BTC_USDC",
		        "volume": 1000.12,
		        "user_count": 10
		    },
            {
		    	"broker_id": null,
		    	"symbol": "PERP_NEAR_USDC",
		        "volume": 1000.12,
		        "user_count": 10
		    }
		],
        "updated_time": 1688371971550
    },
    "timestamp": 1688371971557
}
```

**Parameters**

| Name        | Type   | Required | Description                                                                                 |
|-------------|--------|----------|---------------------------------------------------------------------------------------------|
| campaign_id | string | Y        |                                                                                             |
| broker_id   | string | N        |                                                                                             |
| symbol      | string | N        | |



### Get Campaign Ranking

> **Request**

```shell
curl '/v1/public/campaign/ranking?campaign_id=1&broker_id=woofi_dex&symbol=PERP_NEAR_USDC&page=1&size=3
```
```java
```
```python
import requests

url = "https://api.orderly.org/v1/public/campaign/ranking?campaign_id=1&broker_id=woofi_dex&symbol=PERP_NEAR_USDC&page=1&size=3"

payload={}
headers = {}

response = requests.request("GET", url, headers=headers, data=payload)
```
```javascript
var axios = require('axios');

var config = {
   method: 'get',
   url: 'https://api.orderly.org/v1/public/campaign/ranking?campaign_id=1&broker_id=woofi_dex&symbol=PERP_NEAR_USDC&page=1&size=3',
   headers: {}
};

axios(config)
.then(function (response) {
   console.log(JSON.stringify(response.data));
})
.catch(function (error) {
   console.log(error);
});

```

**Limit: 10 requests per 1 second per IP address**

`GET /v1/public/campaign/ranking`


> **Response**

```json
{
    "success": true,
    "data": {
      	"meta":{
         	"current_page": 1,
         	"records_per_page": 3,
         	"total": 12
      	},
        "rows": [
            {
		    	"account_id": "account01.near",
		        "volume": 1000.12
		    },
            {
		    	"account_id": "account02.near",
		        "volume": 900.12
		    },
            {
		    	"account_id": "account03.near",
		        "volume": 800.12
		    }
		],
    	"updated_time": 1688371971550
    },
    "timestamp": 1688371971557
}
```

**Parameters**

| Name        | Type   | Required | Description                                                                                 |
|-------------|--------|----------|---------------------------------------------------------------------------------------------|
| campaign_id | string | Y        |                                                                                             |
| broker_id   | string | N        |                                                                                             |
| symbol      | string | N        | |



### Get TradingView localized configuration info

> **Request**

```shell
curl 'https://api.orderly.org/v1/tv/config?locale=en'
```
```java
```
```python
```
```javascript
```

**Limit: 10 requests per 1 second per IP address**

`GET /v1/tv/config`


> **Response**

```json
{
  "s": "ok",
  "d": {
    "accountSummaryRow": [
      {
        "id": "accountBalance",
        "title": "Account Balance"
      },
      {
        "id": "Equity",
        "title": "Realized P/L"
      },
      {
        "id": "Open Profit",
        "title": "Unrealized P/L"
      }
    ],
    "accountManager": [
      {
        "id": "accountSummary",
        "title": "",
        "columns": [
          {
            "id": "todayPL",
            "title": "Today's P&L"
          },
          {
            "id": "accountValue",
            "title": "Account Value"
          },
          {
            "id": "balance",
            "title": "Balance"
          },
          {
            "id": "totalMargin",
            "title": "Margin"
          },
          {
            "id": "held",
            "title": "Held"
          },
          {
            "id": "buyingPower",
            "title": "Buying Power"
          }
        ]
      }
    ],
    "durations": [
      {
        "id": "GTT",
        "title": "Good Till Time",
        "hasDatePicker": true,
        "hasTimePicker": true,
        "default": true,
        "supportedOrderTypes": [
          "stop",
          "stoplimit"
        ]
      }
    ],
    "orderCustomFields": [
      {
        "id": "commission",
        "title": "Commission",
        "tooltip": "Commission Fees",
        "alignment": "right"
      }
    ],
    "orderHistoryCustomFields": [
      {
        "id": "commission",
        "title": "Commission",
        "tooltip": "Commission Fees",
        "alignment": "right"
      }
    ],
    "positionCustomFields": [
      {
        "id": "exchangeFee",
        "title": "Exchange fee",
        "tooltip": "Exchange fee for the position",
        "alignment": "right"
      },
      {
        "id": "routeFee",
        "title": "Route fee",
        "tooltip": "Route fee for the position",
        "alignment": "right"
      }
    ],
    "pullingInterval": {
      "quotes": 500,
      "orders": 500,
      "positions": 1000,
      "accountManager": 1000,
      "balances": 1000
    }
  }
}
```

**Parameters**

| Name    | Type      | Required      | Description                                                                                 |
|---------|-----------|---------------|---------------------------------------------------------------------------------------------|
| locale  | string    | Y             |                                                                                             |



### Get TradingView history bars

> **Request**

```shell
curl 'https://api.orderly.org/v1/tv/history?symbol=SPOT_NEAR_USDC&resolution=D&from=0&to=1683881314470'
```
```java
```
```python
```
```javascript
```

**Limit: 10 requests per 1 second per IP address**

`GET /v1/tv/history`


> **Response**

```json
{
  "s": "ok",
  "t": [
    1547942400,
    1547942460,
    1547942520
  ],
  "o": [
    3667,
    3662.25,
    3664.29
  ],
  "h": [
    3667.24,
    3664.47,
    3664.3
  ],
  "l": [
    3661.55,
    3661.9,
    3662.43
  ],
  "c": [
    3662.25,
    3663.13,
    3664.01
  ],
  "v": [
    34.7336,
    2.4413,
    11.7075
  ]
}
```

**Parameters**

| Name       | Type      | Required | Description                                                                                 |
|------------|-----------|----------|---------------------------------------------------------------------------------------------|
| symbol     | string    | Y        |                                                                                             |
| resolution | string    | Y        |                                                                                             |
| from       | timestamp | Y        |                                                                                             |
| to         | timestamp | Y        |                                                                                             |


### Get TradingView symbol info

> **Request**

```shell
curl 'https://api.orderly.org/v1/tv/symbol_info?group=MSFT'
```
```java
```
```python
```
```javascript
```

**Limit: 10 requests per 1 second per IP address**

`GET /v1/tv/symbol_info`


> **Response**

```json
{
  "s": "ok",
  "symbol": [
    "VIXG2019",
    "AAPLE",
    "EURUSD"
  ],
  "description": [
    "Volatility Index",
    "Apple Inc",
    "EUR/USD"
  ],
  "currency": [
    "USD",
    "USD",
    "USD"
  ],
  "base-currency": [
    null,
    null,
    "EUR"
  ],
  "exchange-listed": [
    "CBOE",
    "NASDAQ",
    "FOREX"
  ],
  "exchange-traded": [
    "CBOE",
    "NASDAQ",
    "FOREX"
  ],
  "minmovement": [
    1,
    1,
    1
  ],
  "minmovement2": [
    0,
    0,
    0
  ],
  "fractional": [
    false,
    false,
    false
  ],
  "pricescale": [
    100,
    100,
    100000
  ],
  "root": [
    "VIX",
    null,
    null
  ],
  "root-description": [
    "Volatility Index",
    null,
    null
  ],
  "has-intraday": [
    true,
    true,
    true
  ],
  "has-no-volume": [
    false,
    false,
    true
  ],
  "type": [
    "futures",
    "stock",
    "forex"
  ],
  "is-cfd": [
    true
  ],
  "ticker": [
    "VIXG2019",
    "AAPLE",
    "EURUSD"
  ],
  "timezone": [
    "America/New_York",
    "America/New_York",
    "America/New_York"
  ],
  "session-regular": [
    "0000-2359:23456",
    "0930-1600",
    "1700-1700"
  ],
  "session-extended": [
    "0000-2359:23456",
    "0400-2000",
    "1700-1700"
  ],
  "session-premarket": [
    null,
    "0400-0930",
    null
  ],
  "session-postmarket": [
    null,
    "1600-2000",
    null
  ],
  "supported-resolutions": [
    [
      "1",
      "3",
      "5",
      "15",
      "30",
      "60",
      "240",
      "D",
      "W"
    ],
    [
      "1",
      "3",
      "5",
      "15",
      "30",
      "60",
      "240",
      "D",
      "W"
    ],
    [
      "1",
      "3",
      "5",
      "15",
      "30",
      "60",
      "240",
      "D",
      "W"
    ]
  ],
  "has-daily": [
    true,
    true,
    true
  ],
  "intraday-multipliers": [
    [
      "1",
      "3",
      "5",
      "15",
      "30",
      "60",
      "240"
    ],
    [
      "1",
      "3",
      "5",
      "15",
      "30",
      "60",
      "240"
    ],
    [
      "1",
      "3",
      "5",
      "15",
      "30",
      "60",
      "240"
    ]
  ],
  "has-weekly-and-monthly": [
    false,
    false,
    false
  ],
  "pointvalue": [
    10,
    1,
    0.00001
  ],
  "expiration": [
    20190213,
    null,
    null
  ],
  "bar-source": [
    "trade",
    "bid",
    "ask"
  ],
  "bar-transform": [
    "openprev",
    "openprev",
    "none"
  ],
  "bar-fillgaps": [
    "true",
    "true",
    "false"
  ],
  "isin": [
    "ZAE000190252",
    "ZAE0001201977",
    "ZAE000567432"
  ],
  "wkn": [
    "A12ABB",
    "A66RTT",
    "A13DDE"
  ]
}
```

**Parameters**

| Name  | Type      | Required | Description                                                                                 |
|-------|-----------|----------|---------------------------------------------------------------------------------------------|
| group | string    | Y        |                                                                                             |




## Private

### Create order

> **Request**

```shell
curl -X POST 'https://api.orderly.org/v1/order' \
    -H 'Content-Type: application/json' \
    -H 'orderly-timestamp: 1649920583000' \
    -H 'orderly-account-id: testuser.near' \
    -H 'orderly-key: ed25519:8tm7dnKYkSc3FzgPuJaw1wztr79eeZpN35nHW5pL5XhX' \
    -H 'orderly-trading-key: 90b8d328cde365b3dd10b194048b677d575c2faf51790ecfa6c2fe8b0403324984b275e7bf4c486b4d713576cf20335e1230537c47aafdde0bd646af9b83a8d6' \
    -H 'orderly-signature: MjK3qraMWTNvzvQ9GZl3HhTSpOWYPkbvbUDqErJCmQUOY5zsr33X3c9G67HdOlR4B2fpdiUXjEABDVSQ97LMBg==' \
    -d '{"order_price": 3.21, "order_quantity": 0.45, "order_type": "LIMIT", "side": "BUY", "symbol": "SPOT_NEAR_USDC", "broker_id": "broker", "signature": "4f400f3955fc5783348c0db04447be99283a78a3b1982603b9206953d456f39c7197214a146111ec586ab79171c4bf6255c320d5261a414a17cf78b42e04859900"}'
```

**Limit: 10 requests per 1 second**

`POST /v1/order`

Place order maker/taker, the order executed information will be update from websocket stream.
will response immediately with an order created message.

`MARKET` type order behavior: it matches until the full size is executed. If the size is too large (larger than whole book) or the matching price exceeds the price limit (refer to `price_range`), then the remaining quantity will be cancelled.

`IOC` type order behavior: it matches as much as possible at the order_price. If not fully executed, then remaining quantity will be cancelled.

`FOK` type order behavior: if the order can be fully executed at the order_price then the order gets fully executed otherwise would be cancelled without any execution.

`POST_ONLY` type order behavior: if the order will be executed with any maker trades at the time of placement, then it will be cancelled without any execution.

`ASK` type order behavior: the order price is guranteed to be the best ask price of the orderbook at the time it gets accepted.

`BID` type order behavior: the order price is guranteed to be the best bid price of the orderbook at the time it gets accepted.

`visible_quantity` behavior: it sets the maximum quantity to be shown on orderbook. By default, it is equal to order_quantity, negative number and number larger than `order_quantity` is not allowed. If it sets to 0, the order would be hidden from the orderbook. It doesn't work for `MARKET`/`IOC`/`FOK` orders since orders with these types would be executed and cancelled immediately and not be shown on orderbook. For `LIMIT`/`POST_ONLY` order, as long as it's not complete, `visible_quantity` is the maximum quantity that shown on orderbook.

`order_amount` behavior: for `MARKET`/`BID`/`ASK` order, order can be placed by `order_amount` instead of `order_quantity`. It's the size of the order in terms of the quote currency instead of the base currency. The order would be rejected if  both `order_amount` and `order_quantity` are provided. The precision of the number should be within 8 digits.

`client_order_id` behavior: customized order_id, a unique id among open orders. Orders with the same `client_order_id` can be accepted only when the previous one if completed, otherwise the order will be rejected.

For `MARKET`/`BID`/`ASK` order, `order_amount` is not supported when placing SELL order while `order_quantity` is not supported when placing BUY order.

> **Response**

```json
{
  "success": true,
  "data":{
      "order_id": 13,
      "client_order_id": "testclientid",
      "order_type": "LIMIT",
      "order_price": 100.12,
      "order_quantity": 0.987654,
      "broker_id": "broker",
      "order_amount":null
  },
  "timestamp": 1639980423855
}
```

**Parameters**

| Name             | Type   | Required | Description                                                                            |
| ---------------- | ------ | -------- | -------------------------------------------------------------------------------------- |
| symbol           | string | Y        |                                                                                        |
| client_order_id  | string | N        | 36 length, default: null                                                               |
| order_type       | enum   | Y        | `LIMIT`/`MARKET`/`IOC`/`FOK`/`POST_ONLY`/`ASK`/`BID`                                   |
| order_price      | number | N        | If order_type is `MARKET`/`ASK`/`BID`, then is not required, otherwise this parameter is required. |
| order_quantity   | number | N        | For `MARKET`/`ASK`/`BID` order, if `order_amount` is given, it is not required.        |
| order_amount     | number | N        | For `MARKET`/`ASK`/`BID` order, the order size in terms of quote currency              |
| visible_quantity | number | N        | The order quantity shown on orderbook. (default: equal to `order_quantity`)            |
| side             | enum   | Y        | `SELL`/`BUY`                                                                           |
| broker_id        | string | N        | for broker use, the id corresponding to broker                                         |
| signature        | string | Y        | trading signature                                                                      |

### Batch create order

> **Request**

```shell
curl -X POST 'https://api.orderly.org/v1/order' \
    -H 'Content-Type: application/json' \
    -H 'orderly-timestamp: 1649920583000' \
    -H 'orderly-account-id: testuser.near' \
    -H 'orderly-key: ed25519:8tm7dnKYkSc3FzgPuJaw1wztr79eeZpN35nHW5pL5XhX' \
    -H 'orderly-trading-key: 90b8d328cde365b3dd10b194048b677d575c2faf51790ecfa6c2fe8b0403324984b275e7bf4c486b4d713576cf20335e1230537c47aafdde0bd646af9b83a8d6' \
    -H 'orderly-signature: MjK3qraMWTNvzvQ9GZl3HhTSpOWYPkbvbUDqErJCmQUOY5zsr33X3c9G67HdOlR4B2fpdiUXjEABDVSQ97LMBg==' \
    -d '"orders": [{"order_price": 3.21, "order_quantity": 0.45, "order_type": "LIMIT", "side": "BUY", "symbol": "SPOT_NEAR_USDC", "broker_id": "broker", "signature": "4f400f3955fc5783348c0db04447be99283a78a3b1982603b9206953d456f39c7197214a146111ec586ab79171c4bf6255c320d5261a414a17cf78b42e04859900"}, {"order_price": 3.2, "order_quantity": 0.45, "order_type": "LIMIT", "side": "BUY", "symbol": "SPOT_NEAR_USDC", "broker_id": "broker", "signature": "a553b00270fdf45358ad047cebcb4e9030d4512e0034bd54caacda0740b966c9652d5106ec80e4dffca21c87b0c34cb64b2c5c78f10efc8944c719d7948dc55500"}]'
```

**Limit: 1 request per 1 second**

`POST /v1/batch-order`

Creates a batch of orders as a list according to the same rules as a single Create Order.

Parameters for each order within the batch will be the same as the create single order. The batch of orders should be sent as a JSON array containing all the orders. The maximum number of orders that can be sent in 1 batch order request is 10. Each order within the batch order request is counted as 1 order towards the overall create order rate limit.

> **Response**

```json
{
  "success": true,
  "data":{
        "rows":[
            {
                "success": true,
                "order_id": 13,
                "client_order_id": "testclientid",
                "order_type": "LIMIT",
                "order_price": 100.12,
                "order_quantity": 0.987654,
                "order_amount": null,
                "broker_id": "broker",
                "error_message": null
            },
            {
                "success": true,
                "order_id": 14,
                "client_order_id": "testclientid",
                "order_type": "MARKET",
                "order_price": null,
                "order_quantity": null,
                "order_amount": 98.7654,
                "broker_id": "broker",
                "error_message": null
            },
            {
                "success": false,
                "order_id": null,
                "client_order_id": null,
                "order_type": null,
                "order_price": null,
                "order_quantity": null,
                "order_amount":null,
                "broker_id": "broker",
                "error_message": "the order need to fit price filter"
            },
        ]
  },
  "timestamp": 1639980423855
}
```

**Parameters**

| Name             | Type   | Required | Description                                                                            |
| ---------------- | ------ | -------- | -------------------------------------------------------------------------------------- |
| symbol           | string | Y        |                                                                                        |
| client_order_id  | string | N        | 36 length, default: null                                                               |
| order_type       | enum   | Y        | `LIMIT`/`MARKET`/`IOC`/`FOK`/`POST_ONLY`/`ASK`/`BID`                                   |
| order_price      | number | N        | If order_type is `MARKET`, then is not required, otherwise this parameter is required. |
| order_quantity   | number | N        | For `MARKET`/`ASK`/`BID` order, if `order_amount` is given, it is not required.        |
| order_amount     | number | N        | For `MARKET`/`ASK`/`BID` order, the order size in terms of quote currency              |
| visible_quantity | number | N        | The order quantity shown on orderbook. (default: equal to `order_quantity`)            |
| side             | enum   | Y        | `SELL`/`BUY`                                                                           |
| broker_id        | string | N        | for broker use, the id corresponding to broker                                         |
| signature        | string | Y        | trading signature                                                                      |

### Edit order

> **Request**

```shell
curl -X PUT 'https://api.orderly.org/v1/order' \
    -H 'Content-Type: application/json' \
    -H 'orderly-timestamp: 1649920583000' \
    -H 'orderly-account-id: testuser.near' \
    -H 'orderly-key: ed25519:8tm7dnKYkSc3FzgPuJaw1wztr79eeZpN35nHW5pL5XhX' \
    -H 'orderly-trading-key: 90b8d328cde365b3dd10b194048b677d575c2faf51790ecfa6c2fe8b0403324984b275e7bf4c486b4d713576cf20335e1230537c47aafdde0bd646af9b83a8d6' \
    -H 'orderly-signature: MjK3qraMWTNvzvQ9GZl3HhTSpOWYPkbvbUDqErJCmQUOY5zsr33X3c9G67HdOlR4B2fpdiUXjEABDVSQ97LMBg==' \
    -d '{“order_id": 8442069, "order_price": 3.21, "order_quantity": 0.45, "order_type": "LIMIT", "side": "BUY", "symbol": "SPOT_NEAR_USDC", "signature": "4f400f3955fc5783348c0db04447be99283a78a3b1982603b9206953d456f39c7197214a146111ec586ab79171c4bf6255c320d5261a414a17cf78b42e04859900"}'
```

**Limit: 10 request per 1 second**

`PUT /v1/order`

Edit a pending order by `order_id`. Only the `order_price` or `order_quantity` can be amended.

> **Response**

```json
{
    "success": true,
    "data": {
        "status": "EDIT_SENT"
    },
    "timestamp": 1639980423855
}
```

**Parameters**

| Name             | Type   | Required | Description                                                                            |
| ---------------- | ------ | -------- | -------------------------------------------------------------------------------------- |
| order_id         | string | Y        | order id of the order                                                                  |
| symbol           | string | Y        |                                                                                        |
| client_order_id  | string | N        | 36 length, default: null                                                               |
| order_type       | enum   | Y        | `LIMIT`/`MARKET`/`IOC`/`FOK`/`POST_ONLY`/`ASK`/`BID`                                   |
| order_price      | number | N        | If order_type is `MARKET`, then is not required, otherwise this parameter is required. |
| order_quantity   | number | N        | For `MARKET`/`ASK`/`BID` order, if `order_amount` is given, it is not required.        |
| order_amount     | number | N        | For `MARKET`/`ASK`/`BID` order, the order size in terms of quote currency              |
| visible_quantity | number | N        | The order quantity shown on orderbook. (default: equal to `order_quantity`)            |
| side             | enum   | Y        | `SELL`/`BUY`                                                                           |
| broker_id        | string | N        | for broker use, has to be the same as the broker_id of the original order              |
| signature        | string | Y        | trading signature                                                                      |

### Cancel order

> **Request**

```shell
curl -X DELETE 'https://api.orderly.org/v1/order?order_id=11&symbol=SPOT_NEAR_USDC&signature=c2e9054e4ea22110f458698247a47d9c58f41ed8e947c01d5859b7798ced1c9d130c267ffec185d25c511167199cc3e7476cd850b4cb928ff08443f97abcbdc100' \
    -H 'Content-Type: application/x-www-form-urlencoded' \
    -H 'orderly-timestamp: 1649920583000' \
    -H 'orderly-account-id: testuser.near' \
    -H 'orderly-key: ed25519:8tm7dnKYkSc3FzgPuJaw1wztr79eeZpN35nHW5pL5XhX' \
    -H 'orderly-trading-key: 90b8d328cde365b3dd10b194048b677d575c2faf51790ecfa6c2fe8b0403324984b275e7bf4c486b4d713576cf20335e1230537c47aafdde0bd646af9b83a8d6' \
    -H 'orderly-signature: wZ8RFGGUzTi7JOvLKkpeElTZ7cg7gZXqnpA9MiIEqb+ig3eX0s/txtjHqiX2986Rn1rRXTLgMRHtgA4/WcfxAg=='
```

**Limit: 10 requests per 1 second**

`DELETE /v1/order?order_id=:oid&symbol=:symbol&signature=:signature`

Cancels a single order by `order_id`.

> **Response**

```json
{
  "success": true,
  "data": {
    "status": "CANCEL_SENT"
  },
  "timestamp": 1639980423855
}
```

**Parameters**

| Name             | Type   | Required | Description                                                                            |
| ---------------- | ------ | -------- | -------------------------------------------------------------------------------------- |
| symbol           | string | Y        |                                                                                        |
| order_id         | number | Y        | id of the order                                                                        |
| signature        | string | Y        | trading signature                                                                      |

### Cancel order by client_order_id

> **Request**

```shell
curl -X DELETE 'https://api.orderly.org/v1/order?client_order_id=115461&symbol=SPOT_NEAR_USDC&signature=c2e9054e4ea22110f458698247a47d9c58f41ed8e947c01d5859b7798ced1c9d130c267ffec185d25c511167199cc3e7476cd850b4cb928ff08443f97abcbdc100' \
    -H 'Content-Type: application/x-www-form-urlencoded' \
    -H 'orderly-timestamp: 1649920583000' \
    -H 'orderly-account-id: testuser.near' \
    -H 'orderly-key: ed25519:8tm7dnKYkSc3FzgPuJaw1wztr79eeZpN35nHW5pL5XhX' \
    -H 'orderly-trading-key: 90b8d328cde365b3dd10b194048b677d575c2faf51790ecfa6c2fe8b0403324984b275e7bf4c486b4d713576cf20335e1230537c47aafdde0bd646af9b83a8d6' \
    -H 'orderly-signature: wZ8RFGGUzTi7JOvLKkpeElTZ7cg7gZXqnpA9MiIEqb+ig3eX0s/txtjHqiX2986Rn1rRXTLgMRHtgA4/WcfxAg=='
```

**Limit: 10 requests per 1 second**

`DELETE /v1/client/order?client_order_id=:coid&symbol=:symbol&signature=:signature`

Cancel an order by `client_order_id`.

> **Response**

```json
{
  "success": true,
  "data": {
      "status": "CANCEL_SENT"
  },
  "timestamp": 1639980423855
}
```

**Parameters**

| Name             | Type   | Required | Description                     |
| ---------------- | ------ | -------- | ------------------------------- |
| symbol           | string | Y        |                                 |
| client_order_id  | string | Y        | client_order_id of the order    |
| signature        | string | Y        | trading signature               |

### Cancel orders in bulk

> **Request**

```shell
curl -X DELETE 'https://api.orderly.org/v1/orders?signature=c2e9054e4ea22110f458698247a47d9c58f41ed8e947c01d5859b7798ced1c9d130c267ffec185d25c511167199cc3e7476cd850b4cb928ff08443f97abcbdc100' \
    -H 'Content-Type: application/x-www-form-urlencoded' \
    -H 'orderly-timestamp: 1649920583000' \
    -H 'orderly-account-id: testuser.near' \
    -H 'orderly-key: ed25519:8tm7dnKYkSc3FzgPuJaw1wztr79eeZpN35nHW5pL5XhX' \
    -H 'orderly-trading-key: 90b8d328cde365b3dd10b194048b677d575c2faf51790ecfa6c2fe8b0403324984b275e7bf4c486b4d713576cf20335e1230537c47aafdde0bd646af9b83a8d6' \
    -H 'orderly-signature: wZ8RFGGUzTi7JOvLKkpeElTZ7cg7gZXqnpA9MiIEqb+ig3eX0s/txtjHqiX2986Rn1rRXTLgMRHtgA4/WcfxAg=='
```

**Limit: 10 requests per 1 second**

`DELETE /v1/orders?broker_id=:broker_id&symbol=:symbol&signature=:signature`

Cancel a list of orders, filtered by `broker_id` and/or `symbol` optionally. This request will cancel all open orders within the filter criteria, and will cancel all open orders if no filter is provided.

> **Response**

```json
{
  "success": true,
  "data": {
    "status": "CANCEL_ALL_SENT"
  },
  "timestamp": 1639980423855
}
```

**Parameters**

| Name             | Type   | Required | Description                                         |
| ---------------- | ------ | -------- | --------------------------------------------------- |
| symbol           | string | N        |                                                     |
| broker_id        | string | N        |                                                     |
| signature        | string | Y        | trading signature                                   |

### Batch cancel orders

> **Request**

```shell
curl -X DELETE 'https://api.orderly.org/v1/batch-order?order_ids=10001,10002&signature=c2e9054e4ea22110f458698247a47d9c58f41ed8e947c01d5859b7798ced1c9d130c267ffec185d25c511167199cc3e7476cd850b4cb928ff08443f97abcbdc100' \
    -H 'Content-Type: application/x-www-form-urlencoded' \
    -H 'orderly-timestamp: 1649920583000' \
    -H 'orderly-account-id: testuser.near' \
    -H 'orderly-key: ed25519:8tm7dnKYkSc3FzgPuJaw1wztr79eeZpN35nHW5pL5XhX' \
    -H 'orderly-trading-key: 90b8d328cde365b3dd10b194048b677d575c2faf51790ecfa6c2fe8b0403324984b275e7bf4c486b4d713576cf20335e1230537c47aafdde0bd646af9b83a8d6' \
    -H 'orderly-signature: wZ8RFGGUzTi7JOvLKkpeElTZ7cg7gZXqnpA9MiIEqb+ig3eX0s/txtjHqiX2986Rn1rRXTLgMRHtgA4/WcfxAg=='
```

**Limit: 10 requests per 1 second**

`DELETE /v1/batch-order?client_order_ids=:order_id_1,:order_id_2&signature=:signature`

Cancel a list of orders by `order_id`. The maximum orders that can be cancelled within 1 batch cancel request is 10.

> **Response**

```json
{
  "success": true,
  "data": {
    "status": "CANCEL_ALL_SENT"
  },
  "timestamp": 1639980423855
}
```

**Parameters**

| Name             | Type   | Required | Description                                                                      |
| ---------------- | ------ | -------- | -------------------------------------------------------------------------------- |
| order_ids        | string | Y        | list of order_ids, comma-separated, with a maximum of 10 order ids per request.  |
| signature        | string | Y        | trading signature                                                                |

### Batch cancel orders by client_order_id

> **Request**

```shell
curl -X DELETE 'https://api.orderly.org/v1/client/batch-order?client_order_ids=10001,10002&signature=c2e9054e4ea22110f458698247a47d9c58f41ed8e947c01d5859b7798ced1c9d130c267ffec185d25c511167199cc3e7476cd850b4cb928ff08443f97abcbdc100' \
    -H 'Content-Type: application/x-www-form-urlencoded' \
    -H 'orderly-timestamp: 1649920583000' \
    -H 'orderly-account-id: testuser.near' \
    -H 'orderly-key: ed25519:8tm7dnKYkSc3FzgPuJaw1wztr79eeZpN35nHW5pL5XhX' \
    -H 'orderly-trading-key: 90b8d328cde365b3dd10b194048b677d575c2faf51790ecfa6c2fe8b0403324984b275e7bf4c486b4d713576cf20335e1230537c47aafdde0bd646af9b83a8d6' \
    -H 'orderly-signature: wZ8RFGGUzTi7JOvLKkpeElTZ7cg7gZXqnpA9MiIEqb+ig3eX0s/txtjHqiX2986Rn1rRXTLgMRHtgA4/WcfxAg=='
```

**Limit: 10 requests per 1 second**

`DELETE /v1/client/batch-order?client_order_ids=:order_id_1,:order_id_2&signature=:signature`

Cancel a list of orders by `client_order_id`. The maximum orders that can be cancelled within 1 batch cancel request is 10.

> **Response**

```json
{
  "success": true,
  "data": {
    "status": "CANCEL_ALL_SENT"
  },
  "timestamp": 1639980423855
}
```

**Parameters**

| Name             | Type   | Required | Description                                                                      |
| ---------------- | ------ | -------- | -------------------------------------------------------------------------------- |
| client_order_ids | string | Y        | list of order_ids, comma-separated, with a maximum of 10 order ids per request.  |
| signature        | string | Y        | trading signature                                                                |

### Get order

> **Request**

```shell
curl 'https://api.orderly.org/v1/order/10' \
    -H 'Content-Type: application/x-www-form-urlencoded' \
    -H 'orderly-timestamp: 1649920583000' \
    -H 'orderly-account-id: testuser.near' \
    -H 'orderly-key: ed25519:8tm7dnKYkSc3FzgPuJaw1wztr79eeZpN35nHW5pL5XhX' \
    -H 'orderly-signature: dG4bkKiqG0dUYLzViRZkvbI6Sy239JxAdNMIBxFZ4w030Jofr0ORV06GHtvXZkaZaWUXE+XAU3fnzKN/5fDeBQ=='
```

**Limit: 10 requests per 1 second**

`GET /v1/order/:order_id`

Get details of a single order by `order_id`.

> **Response**

```json
{
    "success": true,
    "data": {
        "order_id": 78151,
        "user_id": 12345,
        "price": 0.67772,
        "type": "LIMIT",
        "quantity": 20,
        "amount": null,
        "executed": 20,
        "visible": 1,
        "symbol": "SPOT_WOO_USDC",
        "side": "BUY",
        "status": "FILLED", // NEW / FILLED / PARTIAL_FILLED / CANCELLED
        "total_fee": 0,
        "fee_asset": "WOO",
        "client_order_id": null,
        "average_executed_price": 0.67772,
        "broker_id": "broker",
        "broker_name": "Broker Name",
        "created_time": 1653563963000,
        "updated_time": 1653564213000
    },
    "timestamp": 1639980423855
}
```

**Parameters**

| Name             | Type   | Required | Description                           |
| ---------------- | ------ | -------- | --------------------------------------|
| order_id         | number | Y        | id of the order                       |

### Get order by client_order_id

> **Request**

```shell
curl 'https://api.orderly.org/v1/client/order/14570120' \
    -H 'Content-Type: application/x-www-form-urlencoded' \
    -H 'orderly-timestamp: 1649920583000' \
    -H 'orderly-account-id: testuser.near' \
    -H 'orderly-key: ed25519:8tm7dnKYkSc3FzgPuJaw1wztr79eeZpN35nHW5pL5XhX' \
    -H 'orderly-signature: dG4bkKiqG0dUYLzViRZkvbI6Sy239JxAdNMIBxFZ4w030Jofr0ORV06GHtvXZkaZaWUXE+XAU3fnzKN/5fDeBQ=='
```

**Limit: 10 requests per 1 second**

`GET /v1/client/order/:client_order_id`

Get details of a single order by `client_order_id`.

> **Response**

```json
{
    "success": true,
    "data": {
        "order_id": 78151,
        "user_id": 12345,
        "price": 0.67772,
        "type": "LIMIT",
        "quantity": 20,
        "amount": null,
        "executed": 20,
        "visible": 1,
        "symbol": "SPOT_WOO_USDC",
        "side": "BUY",
        "status": "FILLED", // NEW / FILLED / PARTIAL_FILLED / CANCELLED
        "total_fee": 0,
        "fee_asset": "WOO",
        "client_order_id": "1234",
        "average_executed_price": 0.67772,
        "broker_id": "broker",
        "broker_name": "Broker Name",
        "created_time": 1644216606000,
        "updated_time": 1644216696000
    },
    "timestamp": 1639980423855
}
```

**Parameters**

| Name             | Type   | Required | Description                           |
| ---------------- | ------ | -------- | --------------------------------------|
| client_order_id  | string | Y        | client id of the order                |

### Get orders

> **Request**

```shell
curl 'https://api.orderly.org/v1/orders?symbol=SPOT_NEAR_USDC&side=BUY&order_type=LIMIT&status=INCOMPLETE&start_t=1644216606000&end_t=1658470850000' \
    -H 'Content-Type: application/x-www-form-urlencoded' \
    -H 'orderly-timestamp: 1649920583000' \
    -H 'orderly-account-id: testuser.near' \
    -H 'orderly-key: ed25519:8tm7dnKYkSc3FzgPuJaw1wztr79eeZpN35nHW5pL5XhX' \
    -H 'orderly-signature: dG4bkKiqG0dUYLzViRZkvbI6Sy239JxAdNMIBxFZ4w030Jofr0ORV06GHtvXZkaZaWUXE+XAU3fnzKN/5fDeBQ=='
```

**Limit: 10 requests per 1 second**

`GET /v1/orders`

Get orders by customized filters.

For filter by status, one can reference special bundled statuses below for ease of access of Open (ie `INCOMPLETE`) orders or `COMPLETED` orders.

- `INCOMPLETE` = `NEW` + `PARTIAL_FILLED`
- `COMPLETED` = `CANCELLED` + `FILLED`

> **Response**

```json
{
    "success": true,
    "data":{
         "meta": {
            "records_per_page": 25,
            "current_page": 1,
            "total": 50
        },
        "rows": [
            {
                "order_id": 78151,
                "user_id": 12345,
                "price": 0.67772,
                "type": "LIMIT",
                "quantity": 20,
                "amount": null,
                "executed": 20,
                "visible": 1,
                "symbol": "SPOT_WOO_USDC",
                "side": "BUY",
                "status": "FILLED", // NEW / FILLED / PARTIAL_FILLED / CANCELLED
                "total_fee": 0,
                "fee_asset": "WOO",
                "client_order_id": null,
                "average_executed_price": 0.67772,
                "broker_id": "broker",
                "broker_name": "Broker Name",
                "created_time": 1644216606000,
                "updated_time": 1644216696000
        },
        // ....skip (total 25 items in one page)
     ]
    },
    "timestamp": 1639980423855
}
```

**Parameters**

| Name      | Type      | Required       | Description                                                                       |
| --------- | --------- | -------------- | --------------------------------------------------------------------------------- |
| symbol    | string    | N              |                                                                                   |
| side      | string    | N              | `BUY`/`SELL`                                                                      |
| order_type| string    | N              | `LIMIT`/`MARKET`                                                                  |
| status    | enum      | N              | `NEW`/`CANCELLED`/`PARTIAL_FILLED`/`FILLED`/`REJECTED`/`INCOMPLETE`/`COMPLETED`   |
| broker_id | string    | N              | filter orders by broker_id                                                        |
| start_t   | timestamp | N              | start time range that wish to query, noted the time stamp is 13-digits timestamp. |
| end_t     | timestamp | N              | end time range that wish to query, noted the time stamp is 13-digits timestamp.   |
| page      | number    | N (default: 1) | the page you wish to query.                                                       |
| size      | number    | N (default: 25)| the page size you wish to query (max: 500)                                        |

### Orderbook snapshot

> **Request**

```shell
curl 'https://api.orderly.org/v1/orderbook/SPOT_NEAR_USDC' \
    -H 'Content-Type: application/x-www-form-urlencoded' \
    -H 'orderly-timestamp: 1649920583000' \
    -H 'orderly-account-id: testuser.near' \
    -H 'orderly-key: ed25519:8tm7dnKYkSc3FzgPuJaw1wztr79eeZpN35nHW5pL5XhX' \
    -H 'orderly-signature: RrNKFNOJJxfQ5M+VdAXLl/KzKPVkPf0g+J87SJLu5rnz8EgdPCafidQkBeQsQX1XpwgzOLxwogYmdYqGAguVAQ=='
```

**Limit: 10 requests per 1 second**

`GET /v1/orderbook/:symbol`

Snapshot of the current orderbook. Price of asks/bids are in descending order.

> **Response**

```json
{
    "success": true,
    "data":{
       "asks": [
        {
            "price": 10669.4,
            "quantity": 1.56263218
        },
        {
            "price": 10670.3,
            "quantity": 0.36466977
        },
        {
            "price": 10670.4,
            "quantity": 0.06738009
        }
    ],
    "bids": [
        {
            "price": 10669.3,
            "quantity": 0.88159988
        },
        {
            "price": 10669.2,
            "quantity": 0.5
        },
        {
            "price": 10668.9,
            "quantity": 0.00488286
        }
    ],
    "timestamp": 1564710591905 // Unix epoch time in milliseconds
   }  
}
```

**Parameters**

| Name      | Type   | Required         | Description                           |
| --------- | ------ | ---------------- | ------------------------------------- |
| max_level | number | N (default: 100) | the levels wish to show on both side. |

### Get kline

> **Request**

```shell
curl 'https://api.orderly.org/v1/kline?symbol=SPOT_NEAR_USDC&type=1d&limit=10' \
    -H 'Content-Type: application/x-www-form-urlencoded' \
    -H 'orderly-timestamp: 1649920583000' \
    -H 'orderly-account-id: testuser.near' \
    -H 'orderly-key: ed25519:8tm7dnKYkSc3FzgPuJaw1wztr79eeZpN35nHW5pL5XhX' \
    -H 'orderly-signature: SymY8zYUBSOiZJkVw7u92WM+Pwv2wAPBefX2wh58JhZUswbj2PrvMuX8jBN1CmVcYxjSWgepK+4V8RzDAUbwDw=='
```

**Limit: 10 requests per 1 second**

`GET /v1/kline`

Get the latest klines (OHLC) of the trading pairs.

> **Response**

```json
{
    "success": true,
    "data":{
         "rows": [
                  {
                      "open": 66166.23,
                      "close": 66124.56,
                      "low": 66038.06,
                      "high": 66176.97,
                      "volume": 23.45528526,
                      "amount": 1550436.21725288,
                      "symbol": "SPOT_BTC_USDC",
                      "type": "1m",
                      "start_timestamp": 1636388220000, // Unix epoch time in milliseconds
                      "end_timestamp": 1636388280000
                  },
                  {
                      "open": 66145.13,
                      "close": 66166.24,
                      "low": 66124.62,
                      "high": 66178.60,
                      "volume": 15.50705000,
                      "amount": 1025863.18892610,
                      "symbol": "SPOT_BTC_USDC",
                      "type": "1m",
                      "start_timestamp": 1636388160000,
                      "end_timestamp": 1636388220000
                  },
                  // ...skip
            ]
      }
}
```

**Parameters**

| Name    | Type   | Required         | Description                                                 |
| ------- | ------ | ---------------- | ----------------------------------------------------------- |
| symbol  | string | Y                |                                                             |
| type    | enum   | Y                | `1m`/`5m`/`15m`/`30m`/`1h`/`4h`/`12h`/`1d`/`1w`/`1mon`/`1y` |
| limit   | number | N (default: 100) | Numbers of klines. Maximum of 1000 klines.                  |

### Get all trades of a specific order

> **Request**

```shell
curl 'https://api.orderly.org/v1/order/10/trades' \
    -H 'Content-Type: application/x-www-form-urlencoded' \
    -H 'orderly-timestamp: 1649920583000' \
    -H 'orderly-account-id: testuser.near' \
    -H 'orderly-key: ed25519:8tm7dnKYkSc3FzgPuJaw1wztr79eeZpN35nHW5pL5XhX' \
    -H 'orderly-signature: jub5km73Rog+6J8Sq5Ff6mrSbceYUurxWFPM44uiGktUCNvpGXJnuNlvj9FRPeENfl4wd56Q7DpzVdYfTpl7Aw=='
```

**Limit: 10 requests per 1 second**

`GET /v1/order/:order_id/trades`

Get specific trades of an order by `order_id`.

> **Response**

```json
{
    "success": true,
    "data":{
        "rows": [
            {
                "id": 2,
                "symbol": "SPOT_BTC_USDC",
                "fee": 0.0001,
                "fee_asset": "BTC", // fee. use Base (BTC) as unit when BUY, use Quote (USDT) as unit when SELL
                "side": "BUY",
                "order_id": 1,
                "executed_price": 123,
                "executed_quantity": 0.05,
                "executed_timestamp": 1567382401000,
                "is_maker": 1
            }
        ]
    },
    "timestamp": 1639980423855
}
```

**Parameters**

| Name             | Type   | Required | Description                           |
| ---------------- | ------ | -------- | --------------------------------------|
| order_id         | number | Y        | id of the order                       |

### Get trades

> **Request**

```shell
curl 'https://api.orderly.org/v1/trades?symbol=SPOT_NEAR_USDC&page=1&size=10&start_t=1644216606000&end_t=1658470850000' \
    -H 'Content-Type: application/x-www-form-urlencoded' \
    -H 'orderly-timestamp: 1649920583000' \
    -H 'orderly-account-id: testuser.near' \
    -H 'orderly-key: ed25519:8tm7dnKYkSc3FzgPuJaw1wztr79eeZpN35nHW5pL5XhX' \
    -H 'orderly-signature: oH4IO4d7SPIHd3cvfQTjKIKHbOpVgwwVxm9Llr19qDZnZoK41nVWau21+YXjTFQaYsByHgjlMOeOLapPWQt5Ag=='
```

**Limit: 10 requests per 1 second**

`GET /v1/trades`

Return client’s trades history within a time range.

> **Response**

```json
{
    "success": true,
    "data":{
         "meta": {
            "records_per_page": 25,
            "current_page": 1,
            "total": 50
        },
        "rows": [
            {
                "id": 2,
                "symbol": "SPOT_BTC_USDT",
                "fee": 0.0001,
                "fee_asset": "BTC", // fee. use Base (BTC) as unit when BUY, use Quote (USDC) as unit when SELL
                "side": "BUY",
                "order_id": 1,
                "executed_price": 123,
                "executed_quantity": 0.05,
                "executed_timestamp": 1567382401000,
                "is_maker": 1
            }
        ]
    },
    "timestamp": 1639980423855
}
```

**Parameters**

| Name      | Type      | Required       | Description                                                                       |
| --------- | --------- | -------------- | --------------------------------------------------------------------------------- |
| symbol    | string    | N              |                                                                                   |
| broker_id | string    | N              | filter orders by broker_id                                                        |
| start_t   | timestamp | N              | start time range that wish to query, noted the time stamp is 13-digits timestamp. |
| end_t     | timestamp | N              | end time range that wish to query, noted the time stamp is 13-digits timestamp.   |
| page      | number    | N (default: 1) | the page you wish to query.                                                       |
| size      | number    | N (default: 25)| the page size you wish to query. (max: 500)                                       |

### Get trade

> **Request**

``` curl
curl 'https://api.orderly.org/v1/trade/2' \
    -H 'Content-Type: application/x-www-form-urlencoded' \
    -H 'orderly-timestamp: 1649920583000' \
    -H 'orderly-account-id: testuser.near' \
    -H 'orderly-key: ed25519:8tm7dnKYkSc3FzgPuJaw1wztr79eeZpN35nHW5pL5XhX' \
    -H 'orderly-signature: 7xJQuog8SkueEQfMcxLeheXxO5Cnyza97+LsYTbVli7mJQWaEb1566heyVAgVCio2UNiJldRpsrTvvhos5WVDg=='
```

**Limit: 10 requests per 1 second**

`GET /v1/trade/:trade_id`

Get specific transaction details by `trade_id`.

> **Response**

```json
{
    "success": true,
    "data": {
        "id": 1,
        "symbol": "SPOT_BTC_USDC",
        "fee": 0.0001,
        "fee_asset": "BTC", // fee. use Base (BTC) as unit when BUY, use Quote (USDC) as unit when SELL
        "side": "BUY",
        "order_id": 2,
        "executed_price": 123,
        "executed_quantity": 0.05,
        "executed_timestamp": 1567382400000,
        "is_maker": 1
    },
    "timestamp": 1639980423855
}
```

**Parameters**

| Name             | Type   | Required | Description                           |
| ---------------- | ------ | -------- | --------------------------------------|
| trade_id         | number | Y        | id of the trade                       |

### Get all position info

> **Request**

```shell
curl 'https://api.orderly.org/v1/positions' \
    -H 'Content-Type: application/x-www-form-urlencoded' \
    -H 'orderly-timestamp: 1649920583000' \
    -H 'orderly-account-id: testuser.near' \
    -H 'orderly-key: ed25519:8tm7dnKYkSc3FzgPuJaw1wztr79eeZpN35nHW5pL5XhX' \
    -H 'orderly-signature: X5TNLJHo9SdDu1qKSfwsSdilqdhncouT2jU0+L0LfKT33kJcLgK3rw4cLTyTt0hU2XCk06ver1AukXwkm344Cg=='
```
```java

```
```python
```

```javascript
```

**Limit: 30 requests per 10 second per user**

`GET /v1/positions`

> **Response**

```json
{
   "data":{
      "current_margin_ratio_with_orders":1.2385,
      "free_collateral":450315.09115,
      "initial_margin_ratio":0.1,
      "initial_margin_ratio_with_orders":0.1,
      "maintenance_margin_ratio":0.05,
      "maintenance_margin_ratio_with_orders":0.05,
      "margin_ratio":1.2385,
      "open_margin_ratio":1.2102,
      "rows":[
         {
            "IMR_withdraw_orders":0.1,
            "MMR_with_orders":0.05,
            "average_open_price":27908.14386047,
            "cost_position":-139329.358492,
            "est_liq_price":117335.92899428,
            "fee_24_h":0.0,
            "imr":0.1,
            "last_sum_unitary_funding":70.38,
            "mark_price":27794.9,
            "mmr":0.05,
            "pending_long_qty":0.0,
            "pending_short_qty":0.0,
            "pnl_24_h":0.0,
            "position_qty":-5.0,
            "settle_price":27865.8716984,
            "symbol":"PERP_BTC_USDC",
            "timestamp":1685429350571,
            "unsettled_pnl":354.858492
         },
        ...
      ],
      "total_collateral_value":489865.71329,
      "total_pnl_24_h":0.0
   },
   "success":true,
   "timestamp":1685431773253
}
```

**Parameters**

None

### Get one position info

> **Request**

```shell
curl 'https://api.orderly.org/v1/position/PERP_ETH_USDC' \
    -H 'Content-Type: application/x-www-form-urlencoded' \
    -H 'orderly-timestamp: 1649920583000' \
    -H 'orderly-account-id: testuser.near' \
    -H 'orderly-key: ed25519:8tm7dnKYkSc3FzgPuJaw1wztr79eeZpN35nHW5pL5XhX' \
    -H 'orderly-signature: iTmMtFTtZYTLJrlTld5H2SFY1VfT5RS4bDU2S+mpisWUzGNslQgQlQDl7OqauFxsbNBU9t1T/azLpOWmu8hiBQ=='
```

**Limit: 30 requests per 10 second per user**

`GET /v1/position/:symbol`

> **Response**

```json
{
   "data":{
      "IMR_withdraw_orders":0.1,
      "MMR_with_orders":0.05,
      "average_open_price":1899.8,
      "cost_position":73999.154647,
      "est_liq_price":0.0,
      "fee_24_h":0.0,
      "imr":0.1,
      "last_sum_unitary_funding":2.901,
      "mark_price":1901.7,
      "mmr":0.05,
      "pending_long_qty":0.0,
      "pending_short_qty":0.0,
      "pnl_24_h":0.0,
      "position_qty":42.0,
      "settle_price":1761.88463445,
      "symbol":"PERP_ETH_USDC",
      "timestamp":1685429350571,
      "unsettled_pnl":5872.245353
   },
   "success":true,
   "timestamp":1685431978956
}
```

**Parameters**

| Name      | Type      | Required      | Description                                             |
| --------- | --------- | ------------- | ------------------------------------------------------- |
| symbol    | string    | Y             |                                                         |


### Get funding fee history

> **Request**

```shell
curl
curl 'https://api.orderly.org/v1/funding_fee/history?symbol=PERP_ETH_USDC&page=1&size=2' \
    -H 'Content-Type: application/x-www-form-urlencoded' \
    -H 'orderly-timestamp: 1649920583000' \
    -H 'orderly-account-id: testuser.near' \
    -H 'orderly-key: ed25519:8tm7dnKYkSc3FzgPuJaw1wztr79eeZpN35nHW5pL5XhX' \
    -H 'orderly-signature: RO8Bv7HGfxit8TENhXTK7CCawsVFFZ0T74BXnDbMupCVkndk7UbjZFrc3zRsMX/jLrsKZXl+RgQsT4TDZ83CCw=='
```

**Limit: 20 requests per 60 second per user**

`GET /v1/funding_fee/history`

Get funding fee history.

> **Response**

```json
{
   "success":true,
   "data":{
      "rows":[
         {
            "symbol":"PERP_ETH_USDC",
            "funding_rate":0.00046875,
            "mark_price":2100.0,
            "funding_fee":1.6e-05,
            "payment_type":"Pay",
            "status":"Accrued",
            "created_time":1682235722003,
            "updated_time":1682235722003
         },
        ...
      ],
      "meta":{
         "total":180,
         "records_per_page":2,
         "current_page":1
      }
   },
   "timestamp":1682235723280
}
```

**Parameters**

| Name      | Type      | Required      | Description                                                                                 |
| ----------|-----------|---------------|---------------------------------------------------------------------------------------------|
| symbol    | string    | Y             |                                                                                             |
| start_t   | timestamp | N             |start time range that you wish to query, noted that the time stamp is a 13-digits timestamp. |
| end_t     | timestamp | N             |end time range that you wish to query, noted that the time stamp is a 13-digits timestamp.   |
| page      | number    | N(default: 1) |the page you wish to query.                                                                  |
| size      | number    | N             |Default: 60                                                                                  |


### Update leverage setting

> **Request**

```shell
curl -X POST 'https://api.orderly.org/v1/client/leverage' \
    -H 'Content-Type: application/json' \
    -H 'orderly-timestamp: 1649920583000' \
    -H 'orderly-account-id: testuser.near' \
    -H 'orderly-key: ed25519:8tm7dnKYkSc3FzgPuJaw1wztr79eeZpN35nHW5pL5XhX' \
    -H 'orderly-trading-key: 90b8d328cde365b3dd10b194048b677d575c2faf51790ecfa6c2fe8b0403324984b275e7bf4c486b4d713576cf20335e1230537c47aafdde0bd646af9b83a8d6' \
    -H 'orderly-signature: MjK3qraMWTNvzvQ9GZl3HhTSpOWYPkbvbUDqErJCmQUOY5zsr33X3c9G67HdOlR4B2fpdiUXjEABDVSQ97LMBg==' \
    -d '{"leverage":10}'
```

**Limit: 5 requests per 60 second per user**

`POST /v1/client/leverage`

Choose maximum leverage for futures mode

> **Response**

```json
{
   "data":{},
   "success":true,
   "timestamp":1685434629597
}
```

**Parameters**

| Name     | Type | Required      | Description         |
|----------|------|---------------|---------------------|
| leverage | int  | Y             | One of 1,2,3,4,5,10 |

### Get liquidated positions by Liquidator

> **Request**

```shell
curl 'https://api.orderly.org/v1/client/liquidator_liquidations' \
    -H 'Content-Type: application/x-www-form-urlencoded' \
    -H 'orderly-timestamp: 1649920583000' \
    -H 'orderly-account-id: testuser.near' \
    -H 'orderly-key: ed25519:8tm7dnKYkSc3FzgPuJaw1wztr79eeZpN35nHW5pL5XhX' \
    -H 'orderly-signature: FxRAdmteyzVDR0HTE+N8VbDNNcKIZfCWkEIePjlEJZz8e0iuhNGvb+KZgG6osU6t0J9d33IWYJALUhA+dnTuBg=='
```

**Limit: 10 requests per 1 second per IP address**

`GET /v1/client/liquidator_liquidations`

> **Response**

```json
{
   "data":{
      "meta":{
         "current_page":1,
         "records_per_page":25,
         "total":20
      },
      "rows":[
         {
            "liquidation_id":1728,
            "positions_by_perp":[
               {
                  "abs_liquidator_fee":1.152279,
                  "cost_position_transfer":65.84448,
                  "liquidator_fee":0.0175,
                  "position_qty":41.6,
                  "symbol":"PERP_NEAR_USDC",
                  "transfer_price":1.5828
               },
              ...
            ],
            "timestamp":1685154032762,
            "type":"liquidated"
         },
        ...
      ]
   },
   "success":true,
   "timestamp":1685433339866
}
```

**Parameters**

| Name      | Type      | Required      | Description                                                                                 |
| ----------|-----------|---------------|---------------------------------------------------------------------------------------------|
| symbol    | string    | Y             |                                                                                             |
| start_t   | timestamp | N             |start time range that you wish to query, noted that the time stamp is a 13-digits timestamp. |
| end_t     | timestamp | N             |end time range that you wish to query, noted that the time stamp is a 13-digits timestamp.   |
| page      | number    | N(default: 1) |the page you wish to query.                                                                  |
| size      | number    | N             |Default: 60                                                                                  |



### Get liquidated positions of account

> **Request**

```shell
curl 'https://api.orderly.org/v1/liquidations' \
    -H 'Content-Type: application/x-www-form-urlencoded' \
    -H 'orderly-timestamp: 1649920583000' \
    -H 'orderly-account-id: testuser.near' \
    -H 'orderly-key: ed25519:8tm7dnKYkSc3FzgPuJaw1wztr79eeZpN35nHW5pL5XhX' \
    -H 'orderly-signature: FxRAdmteyzVDR0HTE+N8VbDNNcKIZfCWkEIePjlEJZz8e0iuhNGvb+KZgG6osU6t0J9d33IWYJALUhA+dnTuBg=='
```

**Limit: 10 requests per 1 second per IP address**

`GET /v1/liquidations`

> **Response**

```json
{
    "success": true,
    "data": {
      "meta": {
        "total": 670,
        "records_per_page": 25,
        "current_page": 1
      },
      "rows": [
        {
          "liquidation_id": 101,
          "timestamp": 1663313562090,
          "transfer_amount_to_insurance_fund": 0,
          "positions_by_perp": [
            {
              "symbol": "PERP_BTC_USDT",
              "position_qty": 1.23,
              "cost_position_transfer": 1350,
              "transfer_price": 18123.43,
              "liquidator_fee": 0.015,
              "insurance_fund_fee": 0.015,
              "abs_liquidation_fee": 3520
            },
            ...
          ]
        },
        ...
      ]
    },
    "timestamp": 1639980423855
}
```

**Parameters**

| Name    | Type      | Required | Description                                                                                 |
|---------|-----------|----------|---------------------------------------------------------------------------------------------|
| symbol  | int       | N        |                                                                                             |
| start_t | timestamp | N        |                                                                                             |
| end_t   | timestamp | N        |                                                                                             |
| page    | number    | N        |                                                                                             |
| size    | number    | N        |                                                                                             |



### Claim liquidated positions 
> **Request**

```shell
curl -X POST 'https://api.orderly.org/v1/liquidation' \
    -H 'Content-Type: application/json' \
    -H 'orderly-timestamp: 1649920583000' \
    -H 'orderly-account-id: testuser.near' \
    -H 'orderly-key: ed25519:8tm7dnKYkSc3FzgPuJaw1wztr79eeZpN35nHW5pL5XhX' \
    -H 'orderly-signature: FxRAdmteyzVDR0HTE+N8VbDNNcKIZfCWkEIePjlEJZz8e0iuhNGvb+KZgG6osU6t0J9d33IWYJALUhA+dnTuBg=='
    -d '{"liquidation_id": 101, "ratio_qty_request": 0.45}'

```

**Limit: 5 requests per 1 second per IP address**

`POST /v1/liquidation`

> **Response**

```json
{
    "success": true,    
    "data": {
        "liquidation_id": 101,
        "timestamp": 1663313562090,
        "type" : "liquidate", // OR "claim"
        "positions_by_perp" : [
          {
              "symbol" : "PERP_BTC_USDT", 
              "position_qty": 1.23,
              "cost_position_transfer": 1350,
              "transfer_price": 18123.43,
              "liquidator_fee": 0.015,
              "abs_liquidator_fee": 3520,
          },
          ...
        ]
    },
  "timestamp": 1639980423855
}
```

**Parameters**

| Name                    | Type      | Required | Description                                                                                 |
|-------------------------|-----------|----------|---------------------------------------------------------------------------------------------|
| liquidation_id          | number    | Y        |                                                                                             |
| ratio_qty_request       | number | Y        |                                                                                             |
| extra_liquidation_ratio | number | N        |                                                                                             |

### Get current holding

> **Request**

```shell
curl 'https://api.orderly.org/v1/client/holding?all=false' \
    -H 'Content-Type: application/x-www-form-urlencoded' \
    -H 'orderly-timestamp: 1649920583000' \
    -H 'orderly-account-id: testuser.near' \
    -H 'orderly-key: ed25519:8tm7dnKYkSc3FzgPuJaw1wztr79eeZpN35nHW5pL5XhX' \
    -H 'orderly-signature: /ko19zTSncCtUMHsld4gm+/Bg1K/wSUBOZCaK3GWLb7R0Q8j6N6awivhHnx4MSN5pR7tTeG4cK0O44SfwSyhCw=='
```

**Limit: 10 requests per 1 seconds**

`GET /v1/client/holding`

Get the current summary of user token holdings.

> **Response**

```json
{
  "success": true,
  "data":{ 
    "holding": [
      {
        "updated_time": 1580794149000, // Unix epoch time in milliseconds
        "token": "BTC",
        "holding": -28.000752,
        "frozen": 0,
        "pending_short": -1
      },
      {
        "updated_time": 1580794149000,
        "token": "USDT",
        "holding": 282485.071904,
        "frozen": 0,
        "pending_short": -2000
      }
    ]
  },
  "timestamp": 1580794149000
}
```

**Parameters**

| Name | Type | Required | Description                                                                    |
| ---- | ---- | -------- | ------------------------------------------------------------------------------ |
| all  | enum | N        | `true`/`false`. If `true` then will return all token even if balance is empty. |

### Get account information

> **Request**

```shell
curl 'https://api.orderly.org/v1/client/info' \
    -H 'Content-Type: application/x-www-form-urlencoded' \
    -H 'orderly-timestamp: 1649920583000' \
    -H 'orderly-account-id: testuser.near' \
    -H 'orderly-key: ed25519:8tm7dnKYkSc3FzgPuJaw1wztr79eeZpN35nHW5pL5XhX' \
    -H 'orderly-signature: xhlfLinlKKYDVDwPk3m4ahK3oCwVKJNJukSrzGEVIXSIbIH3U4mwc6IKn16aRqKx+Js+lvTfQT/w/bHmdDsqBA=='
```

**Limit: 10 requests per 60 seconds**

`GET /v1/client/info`

Get basic account information including current user fee rates.

> **Response**

```json
{
    "success": true,
    "data": {
        "account_id": "test.near",
        "email": "test@test.com",
        "account_mode":"FUTURES", //account mode
        "max_leverage": 5,
        "tier": "1",
        "taker_fee_rate": 0,
        "maker_fee_rate": 0,
        "futures_taker_fee_rate": 0,
        "futures_maker_fee_rate": 0,
        "imr_factor": {
          "BTC" : 0.0000002512,
          "ETH" : 0.0000003003,
          "NEAR": 0.0000048045
        },
        "maintenance_cancel_orders": true
    },
    "timestamp": 1580794149000
}
```

**Parameters**

None


### Get user statistics

> **Request**

```shell
curl 'https://api.orderly.org/v1/client/statistics' \
    -H 'Content-Type: application/x-www-form-urlencoded' \
    -H 'orderly-timestamp: 1649920583000' \
    -H 'orderly-account-id: testuser.near' \
    -H 'orderly-key: ed25519:8tm7dnKYkSc3FzgPuJaw1wztr79eeZpN35nHW5pL5XhX' \
    -H 'orderly-signature: xhlfLinlKKYDVDwPk3m4ahK3oCwVKJNJukSrzGEVIXSIbIH3U4mwc6IKn16aRqKx+Js+lvTfQT/w/bHmdDsqBA=='
```

**Limit: 10 requests per 60 seconds**

`GET /v1/client/statistics`

Get statistics of the user account

> **Response**

```json
{
    "success": true,
    "data": {
        "days_since_registration": 109,
        "fees_paid_last_30_days": 0,
        "perp_fees_paid_last_30_days": 0,
        "perp_trading_volume_last_24_hours": 0,
        "perp_trading_volume_last_30_days": 0,
        "perp_trading_volume_ytd": 0,
        "trading_volume_last_24_hours": 0,
        "trading_volume_last_30_days": 0,
        "trading_volume_ytd": 459.7436
    },
    "timestamp": 1580794149000
}
```

**Parameters**

None


### Set maintenance config

> **Request**

```shell
curl -X POST 'https://api.orderly.org/v1/client/maintenance_config' \
    -H 'Content-Type: application/json' \
    -H 'orderly-timestamp: 1649920583000' \
    -H 'orderly-account-id: testuser.near' \
    -H 'orderly-key: ed25519:8tm7dnKYkSc3FzgPuJaw1wztr79eeZpN35nHW5pL5XhX' \
    -H 'orderly-signature: JRaXrOez2OeM20AbpqANI3Rw651BV9c0vBYfvmn9P6XT3jiwWltIKOBNvqEIk+73lnUnZUYyv2m+M1KIQWmPAA==' \
    -d '{"maintenance_cancel_order_flag": false}'
```

**Limit: 10 requests per 60 seconds**

`POST /v1/client/maintenance_config`

Set the user config for whether the system should automatically cancel the user's pending orders during maintenance.

> **Response**

```json
{
    "success": true,
    "data": {
        "success_alter": "Success! Your change has been saved!"
    },
    "timestamp": 1671074869440
}
```

**Parameters**

| Name                           | Type    | Required | Description                                                                  |
| ------------------------------ | ------- | -------- | -----------------------------------------------------------------------------|
| maintenance_cancel_order_flag  | boolean | Y        | if true, system will cancel all of user's pending orders during maintenance. |

### Get asset history

> **Request**

```shell
curl 'https://api.orderly.org/v1/asset/history' \
    -H 'Content-Type: application/x-www-form-urlencoded' \
    -H 'orderly-timestamp: 1649920583000' \
    -H 'orderly-account-id: testuser.near' \
    -H 'orderly-key: ed25519:8tm7dnKYkSc3FzgPuJaw1wztr79eeZpN35nHW5pL5XhX' \
    -H 'orderly-signature: 7BWu9CKHza3AaISdUsQbfBuHn/spT6znptDbmQz0Aw+wwNB5rqX6VnzPHQm1pbGvGHhHbYFig0YJRkeMZs/NDA=='
```

**Limit 10 requests per 60 seconds**

`GET /v1/asset/history`

Get asset history, including token deposits/withdrawals.

> **Response**

```json
{
    "success": true,
    "data": {
        "meta": {
            "records_per_page": 25,
            "current_page": 1,
            "total": 150
        },
        "rows": [
            {
              
                "id": "202029292829292",
                "uuid": "81da2a0b-33ea-46c0-be10-ed5176e944d4",
                "token": "ETH",
                "side": "DEPOSIT",
                "amount": 1000,
                "tx_id": "3Q4frajLnGhiWHJweQ9aNYqB1m6SqK2KWHd8giM7968a",
                "fee": 0,
                "broker_id": "",
                "trans_status": "COMPLETED",
                "created_time": 1579399877000,  // Unix epoch time in seconds
                "updated_time": 1579399877000  // Unix epoch time in seconds
            },
            ...
        ]
    },
    "timestamp": 1580794149000
}
```

**Parameters**

| Name      | Type      | Required       | Description                                                                       |
| --------- | --------- | -------------- | --------------------------------------------------------------------------------- |
| token     | string    | N              | token name you want to search                                                     |
| side      | string    | N              | `DEPOSIT`/`WITHDRAW`                                                              |
| status    | string    | N              | `NEW`/`CONFIRM`/`PROCESSING`/`COMPLETED`/`FAILED`                                 |
| broker_id | string    | N              | filter orders by broker_id                                                        |
| start_t   | timestamp | N              | start time range that wish to query, noted the time stamp is 13-digits timestamp. |
| end_t     | timestamp | N              | end time range that wish to query, noted the time stamp is 13-digits timestamp.   |
| page      | number    | N (default: 1) | the page you wish to query.                                                       |
| size      | number    | N (default: 25)| the page size you wish to query. (max: 500)                                       |

### Get user daily volume

> **Request**

```shell
curl 'https://api.orderly.org/v1/volume/user/daily' \
    -H 'Content-Type: application/x-www-form-urlencoded' \
    -H 'orderly-timestamp: 1649920583000' \
    -H 'orderly-account-id: testuser.near' \
    -H 'orderly-key: ed25519:8tm7dnKYkSc3FzgPuJaw1wztr79eeZpN35nHW5pL5XhX' \
    -H 'orderly-signature: 7BWu9CKHza3AaISdUsQbfBuHn/spT6znptDbmQz0Aw+wwNB5rqX6VnzPHQm1pbGvGHhHbYFig0YJRkeMZs/NDA=='
```

**Limit 10 requests per 60 seconds**

`GET /v1/volume/user/daily`

Get the daily historical breakdown of the user trading volume by `broker_id`. 

The provided `start_date`/`end_date` has to be within a 90-day range.

> **Response**

```json
{
    "success": true,
    "data": [
        {
            "date": "2022-02-01",
            "broker_id": "woofi_dex",
            "spot_volume": 100.12,
            "perp_volume": 100.12
        },
        {
            "date": "2022-02-02",
            "broker_id": "woofi_dex",
            "spot_volume": 100.12,
            "perp_volume": 100.12,
        }
    ],
    "timestamp": 1580794149000
}
```

**Parameters**

| Name       | Type   | Required | Description                                                                                       |
| ---------- | ------ | -------- | ------------------------------------------------------------------------------------------------- |
| start_date | string | N        | Format YYYY-MM-DD.                                                                                |
| end_date   | string | N        | Format YYYY-MM-DD.                                                                                |
| broker_id  | string | N        | If provided, statistics will be regarding the particular broker rather than the Orderly platform. |

### Get user volume statistics

> **Request**

```shell
curl 'https://api.orderly.org/v1/volume/user/stats' \
    -H 'Content-Type: application/x-www-form-urlencoded' \
    -H 'orderly-timestamp: 1649920583000' \
    -H 'orderly-account-id: testuser.near' \
    -H 'orderly-key: ed25519:8tm7dnKYkSc3FzgPuJaw1wztr79eeZpN35nHW5pL5XhX' \
    -H 'orderly-signature: 7BWu9CKHza3AaISdUsQbfBuHn/spT6znptDbmQz0Aw+wwNB5rqX6VnzPHQm1pbGvGHhHbYFig0YJRkeMZs/NDA=='
```

**Limit 10 requests per 60 seconds**

`GET /v1/volume/user/stats`

Get the latest volume statistics of the user.

> **Response**

```json
{
    "success": true,
    "data": [
        {
            "spot_volume_ytd":1312.9,
            "perp_volume_ytd":274148.0364,
            "spot_volume_ltd":1212.91,
            "perp_volume_ltd":274148.0364,
            "spot_volume_last_7_days":0,
            "perp_volume_last_7_days":120272.7674,
            "spot_volume_last_30_days":899.74,
            "perp_volume_last_30_days":300730.5454
        }
    ],
    "timestamp": 1580794149000
}
```

**Parameters**

| Name      | Type   | Required        | Description                                                                       |
| --------- | ------ | --------------- | --------------------------------------------------------------------------------- |
| broker_id | string | N               | If provided, statistics will only include volume placed via the specified broker. |


### Get Withdrawal Nonce

> **Request**

```shell
curl 'https://api-v2.orderly.org/v1/withdraw_nonce'
```

**Limit 10 requests per 1 seconds**

`GET /v1/withdraw_nonce`

Retrieve a nonce used for requesting a withdrawal on Orderly Network. Each nonce can only be used once.

> **Response**

```json
{
    "success":true,
    "data":{
      "withdraw_nonce": 1
    },
    "timestamp":1685673968302
}
```

**Parameters**
None

### Create Withdraw Request

> **Request**

``` shell
curl -X POST 'https://api-v2.orderly.org/v1/withdrawal_request'
    -H 'Content-Type: application/json' \
    -d '{ \
        "message": { \
            "brokerId": "woofi_dex", \
            "chainId": 43113, \
            "receiver": "0x6bf34299774aa438d257682a0a6f6da0456de6dc", \
            "token": "USDC", \
            "amount": "50000000", \
            "withdrawNonce": 2, \
            "timestamp": 1689075664799 \
        }, \
        "signature": "0x1c8646ded35532f1a3b616c39071e95143519bd5883b76d06c80fcdefda2c26748d3e992a0a33c9c3c350f816e75c1efc548c83dbffab0f67e8138fcb6f7ea681c", \
        "userAddress": "0xc7ef8c0853ccb92232aa158b2af3e364f1bae9a1", \
        "verifyingContract": "0x7831C3587388bdC4b037E4F01C82Edd1d4edCA99"
    }'
```

```java
```

```python
```

```javascript

```

**Limit: 10 requests per 1 second per IP address**

`POST /v1/withdrawal_request`

> **Response**

```json
{
    "success": true,
    "timestamp": 1689075697206
}
```

**Parameters**

| Name                  | Type      | Required | Description                                                                                      |
|-----------------------|-----------|----------|--------------------------------------------------------------------------------------------------|
| message               | JSON      | Y        | Message object containing the message that is signed by the wallet owner                         |
| message.brokerId      | string    | Y        | Broker ID, valid list can be found [here]                                                        |
| message.chainId       | int       | Y        | Chain ID of registering chain (within those that are supported by the Network)                   |
| message.receiver      | string    | Y        | Address of the receiver, which should be equal to the address of the account.                    |
| message.token         | string    | Y        | The string representation of the token that is being withdrawn (eg "USDC")                       |
| message.amount        | int       | Y        | Amount of tokens to be withdrawn                                                                 |
| message.withdrawNonce | int       | Y        | Valid withdrawal nonce from <Get withdrawal nonce>                                                 |
| message.timestamp     | timestamp | Y        | current timestamp in UNIX milliseconds |
| signature             | string    | Y        | The signature generated by signing the message object via EIP-712                                |
| userAddress           | string    | Y        | The address of the wallet signing the message object via EIP-712                                 |
| verifyingContract     | string    | Y        | Address of the Orderly Network ledger contract (which can be found [here])                       |


### Get Settle PnL nonce

> **Request**

``` shell
curl 'https://api-v2.orderly.org/v1/settle_nonce'
```

```java
```

```python
```

```javascript

```

**Limit: 10 requests per 1 second**

`GET /v1/settle_nonce`

Retrieve a nonce used for requesting a withdrawal on Orderly Network. Each nonce can only be used once.

> **Response**

```json
{
    "success":true,
    "data":{
      "settle_nonce": 1
    },
    "timestamp":1685673968302
}
```

**Parameters**
None


### Request PnL Settlement 

> **Request**

``` shell
curl -X POST 'https://api-v2.orderly.org/v1/settle_pnl'
    -H 'Content-Type: application/json' \
    -d '{ \
        "message": { \
            "brokerId": "woofi_dex", \
            "chainId": 43113, \
            "settleNonce": 2, \
            "timestamp": 1689075664799 \
        }, \
        "signature": "0x1c8646ded35532f1a3b616c39071e95143519bd5883b76d06c80fcdefda2c26748d3e992a0a33c9c3c350f816e75c1efc548c83dbffab0f67e8138fcb6f7ea681c", \
        "userAddress": "0xc7ef8c0853ccb92232aa158b2af3e364f1bae9a1", \
        "verifyingContract": "0x7831C3587388bdC4b037E4F01C82Edd1d4edCA99"
    }'
```

```java
```

```python
```

```javascript

```

**Limit: q requests per 1 second**

`POST /v1/settle_pnl`

> **Response**

```json
{ 
    "success": true,
    "timestamp": 1689075697206
}
```

**Parameters**

| Name                | Type      | Required | Description                                                                                      |
|---------------------|-----------|----------|--------------------------------------------------------------------------------------------------|
| message             | JSON      | Y        | Message object containing the message that is signed by the wallet owner                         |
| message.brokerId    | string    | Y        | Broker ID, valid list can be found [here]                                                        |
| message.chainId     | int       | Y        | Chain ID of registering chain (within those that are supported by the Network)                   |
| message.settleNonce | int       | Y        | Nonce from <Get settle PnL Nonce>                                              |
| message.timestamp   | timestamp | Y        | current timestamp in UNIX milliseconds |
| signature           | string    | Y        | The signature generated by signing the message object via EIP-712                                |
| userAddress         | string    | Y        | The address of the wallet signing the message object via EIP-712                                 |



### Get PnL settlement history

> **Request**

``` shell
curl '<https://api-v2.orderly.org/v1/pnl_settlement/history'> \
    -H 'Content-Type: application/x-www-form-urlencoded' \
    -H 'orderly-timestamp: 1649920583000' \
    -H 'orderly-account-id: 0x0f29bfb4c1bc9fea3f3be46bab6d795e22a6272354b136fde05f6b80cfcad546' \
    -H 'orderly-key: ed25519:8tm7dnKYkSc3FzgPuJaw1wztr79eeZpN35nHW5pL5XhX' \
    -H 'orderly-signature: 7BWu9CKHza3AaISdUsQbfBuHn/spT6znptDbmQz0Aw+wwNB5rqX6VnzPHQm1pbGvGHhHbYFig0YJRkeMZs/NDA=='
```

```java
```

```python
```

```javascript

```

**Limit: 20 requests per 1 second**

`GET /v1/pnl_settlement/history`

Retrieve the historical PnL settlement history of the account.

> **Response**

```json
{
    "success": true,
    "data": {
      "meta": {
          "total": 670,
          "records_per_page": 25,
          "current_page": 1
      },
      "rows": [
          {
              "id": 10001,
              "old_balance": 4050,
              "new_balance": 3050,
              "settled_amount": -1000,
              "requested_time": 1575014255089, // Unix epoch time in ms
              "settled_time": 1575014255910 // Unix epoch time in ms
              "symbols": [
                {
                  "symbol": "PERP_BTC_USDT",
                  "settled_amount": -500,
                },
                {
                  "symbol": "PERP_ETH_USDT",
                  "settled_amount": -200,
                },
                ...
              ]
          },
          // ....skip (total 25 items in one page)
    ],
  },
  "timestamp": 1580794149000
}
```

**Parameters**

| Name    | Type      | Required | Description                                                                                     |
|---------|-----------|----------|-------------------------------------------------------------------------------------------------|
| start_t | timestamp | N        |                        |
| end_t   | timestamp    | N        |                                                    |
| page    | int       | N        |            |
| size    | int       | N        |                         |

### Get current Orderly/Trading key info

> **Request**

```shell
curl 'https://api.orderly.org/v1/client/key_info' \
    -H 'Content-Type: application/x-www-form-urlencoded' \
    -H 'orderly-timestamp: 1649920583000' \
    -H 'orderly-account-id: testuser.near' \
    -H 'orderly-key: ed25519:8tm7dnKYkSc3FzgPuJaw1wztr79eeZpN35nHW5pL5XhX' \
    -H 'orderly-signature: 7BWu9CKHza3AaISdUsQbfBuHn/spT6znptDbmQz0Aw+wwNB5rqX6VnzPHQm1pbGvGHhHbYFig0YJRkeMZs/NDA=='
```

**Limit 10 requests per 60 seconds**

`GET /v1/client/key_info`

Retrieve all the registered Orderly key and Trading key pairs under the account.

> **Response**

```json
{
    "success": true,
    "data": [
        {
            "orderly_key": "ed25519:B4yEc8xMjoqdUiKT5ZT1b2cUy5cggZrbMPvCrqyjkQhf",
            "trading_key": "OGQ1MzM3YjlmYzUxMGMwZGIyODVkMDViOTMyZjkwMTVkNjQ0YzBhNjc1OTYwYjhjNmU5Mjc3YTAyNDQ4NTU1MA==",
            "key_status": "ACTIVE", // ACTIVE / REMOVING / REMOVED
            "ip_restriction_list": [],
            "ip_restricion_status": "ALLOW_ALL_IPS" // ALLOW_RESTRICTION_LIST / ALLOW_ALL_IPS / DISALLOW_ALL_IPS

        },
        {
            "orderly_key": "ed25519:5cpaFmLZuAPZuzzT33EQGSGbdw89oYbcAUaeyoDSeh8Y",
            "trading_key": "MzhmODA4ZjNjNTdlMmIwMjk4YWIyZDc4OGQ4ZjdjZDFlZjYyNmIyODhjYjkzYjIwMjA0MmQ0NDI5NjIwMTc1Ng==",
            "key_status": "REMOVED"
            "ip_restriction_list": [],
            "ip_restricion_status": "ALLOW_ALL_IPS" // ALLOW_RESTRICTION_LIST / ALLOW_ALL_IPS / DISALLOW_ALL_IPS
        }
    ],
    "timestamp": 1580794149000
}
```

**Parameters**

| Name       | Type      | Required       | Description                                                                       |
| ---------- | --------- | -------------- | --------------------------------------------------------------------------------- |
| key_status | string    | N              | Filter by the status of the key (ACTIVE / REMOVING / REMOVED)                     |

### Get trading key IP restriction

> **Request**

```shell
curl 'https://api.orderly.org/v1/client/trading_key_ip_restriction?trading_key=ODBkYTQ2MDYzMmY4YzQzY2FmMzhjZjM0MDcyNjQ0NGI3ZTZhZDMwYTQ0YjllODk0YTRiYjYyNTMxZjI0NjIzZA==' \
    -H 'Content-Type: application/x-www-form-urlencoded' \
    -H 'orderly-timestamp: 1649920583000' \
    -H 'orderly-account-id: testuser.near' \
    -H 'orderly-key: ed25519:8tm7dnKYkSc3FzgPuJaw1wztr79eeZpN35nHW5pL5XhX' \
    -H 'orderly-signature: 7BWu9CKHza3AaISdUsQbfBuHn/spT6znptDbmQz0Aw+wwNB5rqX6VnzPHQm1pbGvGHhHbYFig0YJRkeMZs/NDA=='
```

**Limit 10 requests per 60 seconds**

`GET /v1/client/trading_key_ip_restriction`

Retrieves the current IP restriction of a particular trading key.

> **Response**

```json
{
    "success": true,
    "data": {
        "account_id": "testuser.near",
        "trading_key": "ODBkYTQ2MDYzMmY4YzQzY2FmMzhjZjM0MDcyNjQ0NGI3ZTZhZDMwYTQ0YjllODk0YTRiYjYyNTMxZjI0NjIzZA==",
        "ip_restriction_list": [
            "218.190.230.163",
            "218.218.218.218"
        ]
    },
    "timestamp": 1580794149000
}
```

**Parameters**

| Name        | Type      | Required       | Description                                                                       |
| ----------- | --------- | -------------- | --------------------------------------------------------------------------------- |
| trading_key | string    | Y              | The Trading Key to query the IP restriction list                                  |

### Add trading key IP restriction

> **Request**

```shell
curl -X POST 'https://api.orderly.org/v1/client/add_trading_key_ip_restriction' \
    -H 'Content-Type: application/json' \
    -H 'orderly-timestamp: 1649920583000' \
    -H 'orderly-account-id: testuser.near' \
    -H 'orderly-key: ed25519:8tm7dnKYkSc3FzgPuJaw1wztr79eeZpN35nHW5pL5XhX' \
    -H 'orderly-signature: JRaXrOez2OeM20AbpqANI3Rw651BV9c0vBYfvmn9P6XT3jiwWltIKOBNvqEIk+73lnUnZUYyv2m+M1KIQWmPAA==' \
    -d '{"trading_key": "ODBkYTQ2MDYzMmY4YzQzY2FmMzhjZjM0MDcyNjQ0NGI3ZTZhZDMwYTQ0YjllODk0YTRiYjYyNTMxZjI0NjIzZA==", "ip_restriction_list": "218.190.230.163,218.218.218.218"}'
```

**Limit: 10 requests per 60 seconds**

`POST /v1/client/add_trading_key_ip_restriction`

Add IP restriction to a particular trading key under the account.

> **Response**

```json
{
    "success": true,
    "timestamp": 1580794149000
}
```

**Parameters**

| Name                | Type    | Required | Description                                                                  |
| ------------------- | ------- | -------- | -----------------------------------------------------------------------------|
| trading_key         | string  | Y        | The Trading Key to set the IP restriction list                               |
| ip_restriction_list | string  | Y        | The list of IP addresses to be added to the IP restriction list, comma separated.  |

### Remove trading key IP restriction

> **Request**

```shell
curl -X POST 'https://api.orderly.org/v1/client/remove_trading_key_ip_restriction' \
    -H 'Content-Type: application/json' \
    -H 'orderly-timestamp: 1649920583000' \
    -H 'orderly-account-id: testuser.near' \
    -H 'orderly-key: ed25519:8tm7dnKYkSc3FzgPuJaw1wztr79eeZpN35nHW5pL5XhX' \
    -H 'orderly-signature: JRaXrOez2OeM20AbpqANI3Rw651BV9c0vBYfvmn9P6XT3jiwWltIKOBNvqEIk+73lnUnZUYyv2m+M1KIQWmPAA==' \
    -d '{"trading_key": "ODBkYTQ2MDYzMmY4YzQzY2FmMzhjZjM0MDcyNjQ0NGI3ZTZhZDMwYTQ0YjllODk0YTRiYjYyNTMxZjI0NjIzZA==", "ip_restriction_list": "218.190.230.163,218.218.218.218"}'
```

**Limit: 10 requests per 60 seconds**

`POST /v1/client/remove_trading_key_ip_restriction`

Remove IP restrictions of a particular trading key under the account.

> **Response**

```json
{
    "success": true,
    "timestamp": 1580794149000
}
```

**Parameters**

| Name               | Type    | Required | Description                                                                           |
| ------------------ | ------- | -------- | --------------------------------------------------------------------------------------|
| trading_key        | string  | Y        | The Trading Key to set the IP restriction list                                        |
| ip_restriction_list| string  | Y        | The list of IP addresses to be removed from the IP restriction list, comma separated. |

### Set trading key IP restriction

> **Request**

```shell
curl -X POST 'https://api.orderly.org/v1/client/set_trading_key_ip_restriction' \
    -H 'Content-Type: application/json' \
    -H 'orderly-timestamp: 1649920583000' \
    -H 'orderly-account-id: testuser.near' \
    -H 'orderly-key: ed25519:8tm7dnKYkSc3FzgPuJaw1wztr79eeZpN35nHW5pL5XhX' \
    -H 'orderly-signature: JRaXrOez2OeM20AbpqANI3Rw651BV9c0vBYfvmn9P6XT3jiwWltIKOBNvqEIk+73lnUnZUYyv2m+M1KIQWmPAA==' \
    -d '{"trading_key": "ODBkYTQ2MDYzMmY4YzQzY2FmMzhjZjM0MDcyNjQ0NGI3ZTZhZDMwYTQ0YjllODk0YTRiYjYyNTMxZjI0NjIzZA==", "ip_restriction_list": "192.168.0.10,192.168.0.1-192.168.0.5"}'
```

**Limit: 10 requests per 60 seconds**

`POST /v1/client/set_trading_key_ip_restriction`

Set the IP restrictions of a particular trading key under the account.

> **Response**

```json
{
    "success": true,
    "data": {
        "ip_restriction_list": [
            "10.1.1.1",
            "10.1.1.2",
            "192.168.0.1-192.168.0.10"
        ]
    }
    "timestamp": 1580794149000
}
```

**Parameters**

| Name                | Type    | Required | Description                                                                   |
| ------------------- | ------- | -------- | ------------------------------------------------------------------------------|
| trading_key         | string  | Y        | The Trading Key to set the IP restriction list.                               |
| ip_restriction_list | string  | Y        | List of IP or IP ranges (comma separated), that will be allowed to place orders with the trading_key. |

### Reset trading key IP restriction

> **Request**

```shell
curl -X POST 'https://api.orderly.org/v1/client/reset_trading_key_ip_restriction' \
    -H 'Content-Type: application/json' \
    -H 'orderly-timestamp: 1649920583000' \
    -H 'orderly-account-id: testuser.near' \
    -H 'orderly-key: ed25519:8tm7dnKYkSc3FzgPuJaw1wztr79eeZpN35nHW5pL5XhX' \
    -H 'orderly-signature: JRaXrOez2OeM20AbpqANI3Rw651BV9c0vBYfvmn9P6XT3jiwWltIKOBNvqEIk+73lnUnZUYyv2m+M1KIQWmPAA==' \
    -d '{"trading_key": "ODBkYTQ2MDYzMmY4YzQzY2FmMzhjZjM0MDcyNjQ0NGI3ZTZhZDMwYTQ0YjllODk0YTRiYjYyNTMxZjI0NjIzZA==", "reset_mode": "ALLOW_ALL_IPS"}'
```

**Limit: 10 requests per 60 seconds**

`POST /v1/client/reset_trading_key_ip_restriction`

Reset the IP restriction of a particular trading key under the account.

> **Response**

```json
{
    "success": true,
    "timestamp": 1580794149000
}
```

**Parameters**

| Name         | Type    | Required | Description                                                                               |
| ------------ | ------- | -------- | ------------------------------------------------------------------------------------------|
| trading_key  | string  | Y        | The Trading Key to set the IP restriction list                                            |
| reset_mode   | string  | Y        | The new mode of the IP restriction for this Trading Key (ALLOW_ALL_IPS, DISALLOW_ALL_IPS).|

### Get all notifications

> **Request**

```shell
curl -X GET 'https://api.orderly.org/v1/notification/inbox/notifications' \
    -H 'Content-Type: application/x-www-form-urlencoded' \
    -H 'orderly-timestamp: 1649920583000' \
    -H 'orderly-account-id: testuser.near' \
    -H 'orderly-key: ed25519:8tm7dnKYkSc3FzgPuJaw1wztr79eeZpN35nHW5pL5XhX' \
    -H 'orderly-signature: JRaXrOez2OeM20AbpqANI3Rw651BV9c0vBYfvmn9P6XT3jiwWltIKOBNvqEIk+73lnUnZUYyv2m+M1KIQWmPAA==' \
```

**Limit: 10 requests per 60 seconds**

`GET /v1/notification/inbox/notifications`

Get all notifications for the user.

Currently the only supported message type is the order filled message.

> **Response**

```json
{
  "success": true,
  "data": {
    "rows": [
      {
        "id": 12345, // notification id
        "message_type": "ORDER_FILLED", // ORDER_FILLED
        "email": "test@orderly.network", // email if bounded to the account
        "application_id": "testuser.near", // wallet address of the account
        "title": "Your order has been filled",
        "type": "TRADE",  // TRADE / SYSTEM
        "level": "GENERAL", // GENERAL / IMPORTANT
        "content_summary": "Your order to buy 1 NEAR/USDC has been filled: 0.5/1 at 1.9876.",
        "content": "<p>Your order to buy 1 NEAR/USDC has been filled: 0.5/1 at 1.9876.</p>",
        "content_raw": { // below example is for a ORDER_FILLED content
            "symbol": "SPOT_NEAR_USDT",
            "side": "BUY",
            "order_id": 1,
            "executed_price": 1.9876, 
            "executed_quantity": 0.5,
            "executed_timestamp": 1567382401000 
        },
        "mark_read": 1, // 1 = READ, 0 = UNREAD
        "operator": 0,
        "created_time": 1670425970373,
        "announcement_id": null
      }
    ],
    "meta": {
      "total": 1,
      "records_per_page": 1,
      "current_page": 1
    }
  },
  "timestamp": 1679021265398
}
```

**Parameters**

| Name      | Type      | Required       | Description                                                                              |
| --------- | --------- | -------------- | -----------------------------------------------------------------------------------------|
| type      | string    | N              | Filter nofications by type (TRADE / SYSTEM).                                             |
| page      | number    | N (default: 1) | the page you wish to query.                                                              |
| size      | number    | N (default: 25)| the page size you wish to query. (max: 500)                                              |

### Get unread notification information

> **Request**

```shell
curl -X GET 'https://api.orderly.org/v1/notification/inbox/unread' \
    -H 'Content-Type: application/x-www-form-urlencoded' \
    -H 'orderly-timestamp: 1649920583000' \
    -H 'orderly-account-id: testuser.near' \
    -H 'orderly-key: ed25519:8tm7dnKYkSc3FzgPuJaw1wztr79eeZpN35nHW5pL5XhX' \
    -H 'orderly-signature: JRaXrOez2OeM20AbpqANI3Rw651BV9c0vBYfvmn9P6XT3jiwWltIKOBNvqEIk+73lnUnZUYyv2m+M1KIQWmPAA==' \
```

**Limit: 10 requests per 60 seconds**

`GET /v1/notification/inbox/unread`

Get the information on unread messages for the user.

> **Response**

```json
{
  "success": true,
  "data": {
    "count": 10, // number of unread messages
    "lastId": 12345 // the id of the last unread message
  },
  "timestamp": 1679028707086
}
```

**Parameters**

None

### Set read status of notifications

> **Request**

```shell
curl -X POST 'https://api.orderly.org/v1/notification/inbox/mark_read' \
    -H 'Content-Type: application/json' \
    -H 'orderly-timestamp: 1649920583000' \
    -H 'orderly-account-id: testuser.near' \
    -H 'orderly-key: ed25519:8tm7dnKYkSc3FzgPuJaw1wztr79eeZpN35nHW5pL5XhX' \
    -H 'orderly-signature: JRaXrOez2OeM20AbpqANI3Rw651BV9c0vBYfvmn9P6XT3jiwWltIKOBNvqEIk+73lnUnZUYyv2m+M1KIQWmPAA==' \
    -d '{"flag": 1, "ids": [12345, 12346]}'
```

**Limit: 10 requests per 60 seconds**

`POST /v1/notification/inbox/mark_read`

Set the read status on a list of notifications for a user.

> **Response**

```json
{
    "success": true,
    "timestamp": 1580794149000
}
```

**Parameters**

| Name               | Type    | Required | Description                                                     |
| ------------------ | ------- | -------- | ----------------------------------------------------------------|
| flag               | number  | Y        | The value of the read flag, where 1 = READ and 0 = UNREAD       |
| ids                | list    | Y        | The list of notification ids to flag as read/unread.            |

### Set read status of all notifications

> **Request**

```shell
curl -X POST 'https://api.orderly.org/v1/notification/inbox/mark_read_all' \
    -H 'Content-Type: application/json' \
    -H 'orderly-timestamp: 1649920583000' \
    -H 'orderly-account-id: testuser.near' \
    -H 'orderly-key: ed25519:8tm7dnKYkSc3FzgPuJaw1wztr79eeZpN35nHW5pL5XhX' \
    -H 'orderly-signature: JRaXrOez2OeM20AbpqANI3Rw651BV9c0vBYfvmn9P6XT3jiwWltIKOBNvqEIk+73lnUnZUYyv2m+M1KIQWmPAA==' \
    -d '{"flag": 1}'
```

**Limit: 10 requests per 60 seconds**

`POST /v1/notification/inbox/mark_read_all`

Set the read status on all notifications for a user.

> **Response**

```json
{
    "success": true,
    "timestamp": 1580794149000
}
```

**Parameters**

| Name               | Type    | Required | Description                                                |
| ------------------ | ------- | -------- | -----------------------------------------------------------|
| flag               | number  | Y        | The value of the read flag, where 1 = READ and 0 = UNREAD  |

### Get PnL Settlement History

> **Request**

```shell
curl -X POST 'https://api.orderly.org/v1/pnl_settlement/history' \
    -H 'Content-Type: application/json' \
    -H 'orderly-timestamp: 1649920583000' \
    -H 'orderly-account-id: testuser.near' \
    -H 'orderly-key: ed25519:8tm7dnKYkSc3FzgPuJaw1wztr79eeZpN35nHW5pL5XhX' \
    -H 'orderly-signature: JRaXrOez2OeM20AbpqANI3Rw651BV9c0vBYfvmn9P6XT3jiwWltIKOBNvqEIk+73lnUnZUYyv2m+M1KIQWmPAA=='
```

**Limit: 20 requests per 60 seconds**

`GET /v1/pnl_settlement/history`

> **Response**

```json
{
    "success": true,
    "data": {
      "meta": {
          "total": 670,
          "records_per_page": 25,
          "current_page": 1
      },
      "rows": [
          {
              "id": 10001,
              "old_balance": 4050,
              "new_balance": 3050,
              "settled_amount": -1000,
              "requested_time": "1575014255.089", // Unix epoch time in seconds
              "settled_time": "1575014255.910" // Unix epoch time in seconds
              "symbols": [
                {
                  "PERP_BTC_USDT",
                  "settled_amount": -500,
                },
                {
                  "PERP_ETH_USDT",
                  "settled_amount": -200,
                },
                ...
              ]
          },
          {
              "id": 10002,
              "old_balance": 4050,
              "new_balance": 3050,
              "settled_amount": -1000,
              "requested_time": "1575014255.089", // Unix epoch time in seconds
              "settled_time": "1575014255.910" // Unix epoch time in seconds
              "symbols": [
                {
                  "PERP_BTC_USDT",
                  "settled_amount": -500,
                },
                {
                  "PERP_ETH_USDT",
                  "settled_amount": -200,
                },
                ...
              ]
          },
          // ....skip (total 25 items in one page)
    ],
  },
  "timestamp": 1580794149000
}
```

**Parameters**

| Name    | Type      | Required | Description                                                     |
|---------|-----------|----------| ----------------------------------------------------------------|
| start_t | timestamp | N        | start time range that you wish to query, noted that the time stamp is a 13-digits timestamp.       |
| end_t   | timestamp | N        | end time range that you wish to query, noted that the time stamp is a 13-digits timestamp.           |
| page    | number    | N        |                                                                 |
| size    | number    | N        |                                                                 |


### Claim from Insurance Fund

> **Request**

```shell
curl -X POST 'https://api.orderly.org/v1/claim_insurance_fund' \
    -H 'Content-Type: application/json' \
    -H 'orderly-timestamp: 1649920583000' \
    -H 'orderly-account-id: testuser.near' \
    -H 'orderly-key: ed25519:8tm7dnKYkSc3FzgPuJaw1wztr79eeZpN35nHW5pL5XhX' \
    -H 'orderly-signature: JRaXrOez2OeM20AbpqANI3Rw651BV9c0vBYfvmn9P6XT3jiwWltIKOBNvqEIk+73lnUnZUYyv2m+M1KIQWmPAA==' \
    -d '{"claim_id": 1001, "qty_request": 1.7}'
```

**Limit: 5 requests per 1 seconds**

`POST /v1/claim_insurance_fund`

> **Response**

```json
{
  "success": true,
  "data": {
    "claim_id": 101,
    "timestamp": 1663313562090,
    "positions_by_perp": [
      {
        "symbol": "PERP_BTC_USDT",
        "position_qty": 1.23,
        "cost_position_transfer": 1350,
        "transfer_price": 18123.43,
        "liquidator_fee": 0.0075,
        "abs_liquidator_fee": 3520
      },
      {
        "symbol": "PERP_ETH_USDT",
        "position_qty": 1.23,
        "cost_position_transfer": 1300,
        "transfer_price": 1400.43,
        "liquidator_fee": 0.0075,
        "abs_liquidator_fee": 3520
      }
    ]
  }
}
```

**Parameters**

| Name        | Type   | Required | Description                                                     |
|-------------|--------|----------| ----------------------------------------------------------------|
| claim_id    | number | Y        |      |
| qty_request | number | Y        |           |
| limit_price | number | N        |                                                                 |
