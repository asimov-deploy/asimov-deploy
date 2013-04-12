/*******************************************************************************
* Copyright (C) 2012 eBay Inc.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
******************************************************************************/

var config = require('./config.js');
var async = require('async');
var restify = require("restify");
var _ = require('underscore');

var data = [
  {
    "name": "SE1-APPSRV-02",
    "loadBalancerEnabled": true,
    "loadBalancerId": 12,
    "units": [
      {
        "name": "UserRegistration.ApplicantRegistration",
        "url": "http://se1-appsrv-02.prod.tradera.com:8007/ApplicantRegistration",
        "version": "13.17.0.0",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-03-06 11:21:52",
        "hasDeployParameters": false
      },
      {
        "name": "UserRegistration.ApplicantFinalization",
        "url": null,
        "version": "13.27.0.4",
        "branch": "production",
        "status": "Stopped",
        "info": "Last deployed: 2013-04-03 10:34:24",
        "hasDeployParameters": false
      },
      {
        "name": "UserRegistration.ApplicantFullValidation",
        "url": null,
        "version": "0.0.0.0",
        "branch": null,
        "status": "Stopped",
        "info": "Last deployed: 0001-01-01 00:00:00",
        "hasDeployParameters": false
      },
      {
        "name": "Listing.ChangeItem",
        "url": "http://se1-appsrv-02.prod.tradera.com:8007/ChangeItem",
        "version": "13.06.0.0",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-02-06 10:36:29",
        "hasDeployParameters": false
      },
      {
        "name": "Listing.CreateItem",
        "url": "http://se1-appsrv-02.prod.tradera.com:8007/CreateItem",
        "version": "13.06.0.0",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-02-06 10:36:59",
        "hasDeployParameters": false
      },
      {
        "name": "Listing.EbayChangeItem",
        "url": "http://se1-appsrv-02.prod.tradera.com:8010/EbayChangeItem",
        "version": "13.06.0.0",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-02-06 10:37:13",
        "hasDeployParameters": false
      },
      {
        "name": "Listing.CreateItem.Handler",
        "url": null,
        "version": "13.06.0.0",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-02-06 09:59:42",
        "hasDeployParameters": false
      },
      {
        "name": "Listing.CreateShopItem.Handler",
        "url": null,
        "version": "13.06.0.0",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-02-06 10:10:19",
        "hasDeployParameters": false
      },
      {
        "name": "Listing.EbayChangeItem.Handler",
        "url": null,
        "version": "13.06.0.0",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-02-06 10:13:46",
        "hasDeployParameters": false
      },
      {
        "name": "Listing.ItemChange",
        "url": null,
        "version": "13.06.0.0",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-02-06 10:14:39",
        "hasDeployParameters": false
      },
      {
        "name": "Listing.ItemClosing",
        "url": null,
        "version": "13.21.0.1",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-03-13 09:35:00",
        "hasDeployParameters": false
      },
      {
        "name": "Billing.CreateItemFees",
        "url": null,
        "version": "13.24.0.0",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-03-21 10:15:59",
        "hasDeployParameters": false
      },
      {
        "name": "Billing.CreateSubscriptionFees",
        "url": null,
        "version": "13.24.0.0",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-03-21 10:17:41",
        "hasDeployParameters": false
      },
      {
        "name": "MemberManagement.ProfileRefinement",
        "url": null,
        "version": "13.18.0.15",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-03-07 08:14:43",
        "hasDeployParameters": false
      },
      {
        "name": "Payment.ProcessingService",
        "url": "http://se1-appsrv-02.prod.tradera.com:8015/PaymentProcessing",
        "version": "13.33.0.0",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-04-09 10:53:43",
        "hasDeployParameters": false
      },
      {
        "name": "Payment.QueryService",
        "url": "http://se1-appsrv-02.prod.tradera.com:8015/PaymentQueries",
        "version": "13.10.0.0",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-02-12 15:01:47",
        "hasDeployParameters": false
      },
      {
        "name": "OrderManagement.PurchaseOrderStatusHandler",
        "url": null,
        "version": "13.33.0.0",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-04-09 10:55:05",
        "hasDeployParameters": false
      },
      {
        "name": "MemberNotifications.Handler",
        "url": null,
        "version": "13.33.0.0",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-04-09 10:51:02",
        "hasDeployParameters": false
      },
      {
        "name": "Marketing.QueryService",
        "url": "http://se1-appsrv-02.prod.tradera.com:8008/Services",
        "version": "12.39.0.0",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2012-12-03 11:18:09",
        "hasDeployParameters": false
      },
      {
        "name": "Marketing.CommandService",
        "url": "http://se1-appsrv-02.prod.tradera.com:8009/Services",
        "version": "12.39.0.0",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2012-12-03 11:17:43",
        "hasDeployParameters": false
      },
      {
        "name": "Marketing.MarketingHandler",
        "url": null,
        "version": "12.39.0.0",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2012-12-03 11:17:53",
        "hasDeployParameters": false
      },
      {
        "name": "SelfService.CreateErrandHandler",
        "url": null,
        "version": "13.33.0.0",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-04-09 12:51:42",
        "hasDeployParameters": false
      },
      {
        "name": "Buying.BuyingHandler",
        "url": null,
        "version": "0.0.0.0",
        "branch": null,
        "status": "Running",
        "info": "Last deployed: 0001-01-01 00:00:00",
        "hasDeployParameters": false
      },
      {
        "name": "Buying.BuyItem",
        "url": "http://se1-appsrv-02.prod.tradera.com:8006/BuyItem",
        "version": "13.21.0.1",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-03-13 08:27:46",
        "hasDeployParameters": false
      },
      {
        "name": "Buying.BidPlacement",
        "url": "http://se1-appsrv-02.prod.tradera.com:8006/BidPlacement",
        "version": "13.32.0.0",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-04-08 10:54:24",
        "hasDeployParameters": false
      },
      {
        "name": "Buying.BuyingDenormalizer",
        "url": null,
        "version": "13.21.0.1",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-03-13 09:10:07",
        "hasDeployParameters": false
      },
      {
        "name": "Buying.Finalization",
        "url": null,
        "version": "13.21.0.1",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-03-13 09:28:14",
        "hasDeployParameters": false
      },
      {
        "name": "FraudDetection.FraudDetectionHandler",
        "url": null,
        "version": "13.25.0.2",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-03-26 10:16:40",
        "hasDeployParameters": false
      },
      {
        "name": "FraudDetection.QueryService",
        "url": "http://se1-appsrv-02.prod.tradera.com:8013/Services",
        "version": "13.25.0.2",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-03-26 10:17:08",
        "hasDeployParameters": false
      }
    ]
  },
  {
    "name": "SE1-APPSRV-01",
    "loadBalancerEnabled": true,
    "loadBalancerId": 11,
    "units": [
      {
        "name": "UserRegistration.ApplicantRegistration",
        "url": "http://se1-appsrv-01.prod.tradera.com:8007/ApplicantRegistration",
        "version": "13.17.0.0",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-03-06 11:21:17",
        "hasDeployParameters": false
      },
      {
        "name": "UserRegistration.ApplicantFinalization",
        "url": null,
        "version": "13.27.0.4",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-04-03 10:28:19",
        "hasDeployParameters": false
      },
      {
        "name": "UserRegistration.ApplicantFullValidation",
        "url": null,
        "version": "0.0.0.0",
        "branch": null,
        "status": "Running",
        "info": "Last deployed: 0001-01-01 00:00:00",
        "hasDeployParameters": false
      },
      {
        "name": "Listing.ChangeItem",
        "url": "http://se1-appsrv-01.prod.tradera.com:8007/ChangeItem",
        "version": "13.06.0.0",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-02-06 10:30:02",
        "hasDeployParameters": false
      },
      {
        "name": "Listing.CreateItem",
        "url": "http://se1-appsrv-01.prod.tradera.com:8007/CreateItem",
        "version": "13.06.0.0",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-02-06 10:30:20",
        "hasDeployParameters": false
      },
      {
        "name": "Listing.CreateItem.Handler",
        "url": null,
        "version": "13.06.0.0",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-02-06 09:59:38",
        "hasDeployParameters": false
      },
      {
        "name": "Listing.CreateShopItem.Handler",
        "url": null,
        "version": "13.06.0.0",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-02-06 10:08:33",
        "hasDeployParameters": false
      },
      {
        "name": "Listing.ItemChange",
        "url": null,
        "version": "13.06.0.0",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-02-06 10:14:13",
        "hasDeployParameters": false
      },
      {
        "name": "Listing.ItemClosing",
        "url": null,
        "version": "13.21.0.1",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-03-13 09:34:20",
        "hasDeployParameters": false
      },
      {
        "name": "Billing.CreateItemFees",
        "url": null,
        "version": "13.24.0.0",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-03-21 10:15:23",
        "hasDeployParameters": false
      },
      {
        "name": "Billing.CreateSubscriptionFees",
        "url": null,
        "version": "13.24.0.0",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-03-21 10:17:36",
        "hasDeployParameters": false
      },
      {
        "name": "MemberManagement.ProfileRefinement",
        "url": null,
        "version": "13.18.0.15",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-03-07 08:12:56",
        "hasDeployParameters": false
      },
      {
        "name": "Payment.ProcessingService",
        "url": "http://se1-appsrv-01.prod.tradera.com:8015/PaymentProcessing",
        "version": "13.33.0.0",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-04-09 10:53:49",
        "hasDeployParameters": false
      },
      {
        "name": "Payment.QueryService",
        "url": "http://se1-appsrv-01.prod.tradera.com:8015/PaymentQueries",
        "version": "13.10.0.0",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-02-12 14:57:52",
        "hasDeployParameters": false
      },
      {
        "name": "OrderManagement.PurchaseOrderStatusHandler",
        "url": null,
        "version": "13.33.0.0",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-04-09 10:55:27",
        "hasDeployParameters": false
      },
      {
        "name": "MemberNotifications.Handler",
        "url": null,
        "version": "13.33.0.0",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-04-09 10:51:20",
        "hasDeployParameters": false
      },
      {
        "name": "Marketing.QueryService",
        "url": "http://se1-appsrv-01.prod.tradera.com:8008/Services",
        "version": "12.39.0.0",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2012-12-03 11:18:06",
        "hasDeployParameters": false
      },
      {
        "name": "Marketing.CommandService",
        "url": "http://se1-appsrv-01.prod.tradera.com:8009/Services",
        "version": "12.39.0.0",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2012-12-03 11:18:58",
        "hasDeployParameters": false
      },
      {
        "name": "Marketing.MarketingHandler",
        "url": null,
        "version": "12.39.0.0",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2012-12-03 11:17:51",
        "hasDeployParameters": false
      },
      {
        "name": "SelfService.CreateErrandHandler",
        "url": null,
        "version": "13.33.0.0",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-04-09 12:51:51",
        "hasDeployParameters": false
      },
      {
        "name": "Buying.BuyingHandler",
        "url": null,
        "version": "0.0.0.0",
        "branch": null,
        "status": "Running",
        "info": "Last deployed: 0001-01-01 00:00:00",
        "hasDeployParameters": false
      },
      {
        "name": "Buying.BuyItem",
        "url": "http://se1-appsrv-01.prod.tradera.com:8006/BuyItem",
        "version": "13.21.0.1",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-03-13 08:09:19",
        "hasDeployParameters": false
      },
      {
        "name": "Buying.BidPlacement",
        "url": "http://se1-appsrv-01.prod.tradera.com:8006/BidPlacement",
        "version": "13.32.0.0",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-04-08 10:46:54",
        "hasDeployParameters": false
      },
      {
        "name": "Buying.BuyingDenormalizer",
        "url": null,
        "version": "13.21.0.1",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-03-13 09:08:29",
        "hasDeployParameters": false
      },
      {
        "name": "Buying.Finalization",
        "url": null,
        "version": "13.21.0.1",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-03-13 09:26:14",
        "hasDeployParameters": false
      },
      {
        "name": "FraudDetection.FraudDetectionHandler",
        "url": null,
        "version": "13.25.0.2",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-03-26 10:17:15",
        "hasDeployParameters": false
      },
      {
        "name": "FraudDetection.QueryService",
        "url": "http://se1-appsrv-01.prod.tradera.com:8013/Services",
        "version": "13.25.0.2",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-03-26 10:17:35",
        "hasDeployParameters": false
      }
    ]
  },
  {
    "name": "SE1-APPSRV-05",
    "loadBalancerEnabled": true,
    "loadBalancerId": 15,
    "units": [
      {
        "name": "UserRegistration.ApplicantRegistration",
        "url": "http://se1-appsrv-05.prod.tradera.com:8007/ApplicantRegistration",
        "version": "13.17.0.0",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-03-06 11:23:32",
        "hasDeployParameters": false
      },
      {
        "name": "UserRegistration.ApplicantFinalization",
        "url": null,
        "version": "13.27.0.4",
        "branch": "production",
        "status": "Stopped",
        "info": "Last deployed: 2013-04-03 10:43:32",
        "hasDeployParameters": false
      },
      {
        "name": "UserRegistration.ApplicantFullValidation",
        "url": null,
        "version": "0.0.0.0",
        "branch": null,
        "status": "Stopped",
        "info": "Last deployed: 0001-01-01 00:00:00",
        "hasDeployParameters": false
      },
      {
        "name": "Listing.ChangeItem",
        "url": "http://se1-appsrv-05.prod.tradera.com:8007/ChangeItem",
        "version": "13.06.0.0",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-02-06 10:50:25",
        "hasDeployParameters": false
      },
      {
        "name": "Listing.CreateItem",
        "url": "http://se1-appsrv-05.prod.tradera.com:8007/CreateItem",
        "version": "13.06.0.0",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-02-06 10:50:42",
        "hasDeployParameters": false
      },
      {
        "name": "Listing.CreateItem.Handler",
        "url": null,
        "version": "13.06.0.0",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-02-06 10:06:47",
        "hasDeployParameters": false
      },
      {
        "name": "Listing.CreateShopItem.Handler",
        "url": null,
        "version": "13.06.0.0",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-02-06 10:12:18",
        "hasDeployParameters": false
      },
      {
        "name": "Listing.ItemChange",
        "url": null,
        "version": "13.06.0.0",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-02-06 10:18:15",
        "hasDeployParameters": false
      },
      {
        "name": "Listing.ItemClosing",
        "url": null,
        "version": "13.21.0.1",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-03-13 09:35:40",
        "hasDeployParameters": false
      },
      {
        "name": "Billing.CreateItemFees",
        "url": null,
        "version": "13.24.0.0",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-03-21 10:17:30",
        "hasDeployParameters": false
      },
      {
        "name": "Billing.CreateSubscriptionFees",
        "url": null,
        "version": "13.24.0.0",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-03-21 10:18:22",
        "hasDeployParameters": false
      },
      {
        "name": "MemberManagement.ProfileRefinement",
        "url": null,
        "version": "13.18.0.15",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-03-07 08:16:37",
        "hasDeployParameters": false
      },
      {
        "name": "Payment.ProcessingService",
        "url": "http://se1-appsrv-05.prod.tradera.com:8015/PaymentProcessing",
        "version": "13.33.0.0",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-04-09 10:53:14",
        "hasDeployParameters": false
      },
      {
        "name": "Payment.QueryService",
        "url": "http://se1-appsrv-05.prod.tradera.com:8015/PaymentQueries",
        "version": "13.10.0.0",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-02-12 15:07:49",
        "hasDeployParameters": false
      },
      {
        "name": "OrderManagement.PurchaseOrderStatusHandler",
        "url": null,
        "version": "13.33.0.0",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-04-09 10:54:45",
        "hasDeployParameters": false
      },
      {
        "name": "MemberNotifications.Handler",
        "url": null,
        "version": "13.33.0.0",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-04-09 10:48:13",
        "hasDeployParameters": false
      },
      {
        "name": "Marketing.QueryService",
        "url": "http://se1-appsrv-05.prod.tradera.com:8008/Services",
        "version": "12.39.0.0",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2012-12-03 11:18:13",
        "hasDeployParameters": false
      },
      {
        "name": "Marketing.CommandService",
        "url": "http://se1-appsrv-05.prod.tradera.com:8009/Services",
        "version": "12.39.0.0",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2012-12-03 11:17:49",
        "hasDeployParameters": false
      },
      {
        "name": "Marketing.MarketingHandler",
        "url": null,
        "version": "12.39.0.0",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2012-12-03 11:17:56",
        "hasDeployParameters": false
      },
      {
        "name": "SelfService.CreateErrandHandler",
        "url": null,
        "version": "13.33.0.0",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-04-09 12:51:20",
        "hasDeployParameters": false
      },
      {
        "name": "Buying.BuyingHandler",
        "url": null,
        "version": "0.0.0.0",
        "branch": null,
        "status": "Running",
        "info": "Last deployed: 0001-01-01 00:00:00",
        "hasDeployParameters": false
      },
      {
        "name": "Buying.BuyItem",
        "url": "http://se1-appsrv-05.prod.tradera.com:8006/BuyItem",
        "version": "13.21.0.1",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-03-13 08:39:34",
        "hasDeployParameters": false
      },
      {
        "name": "Buying.BidPlacement",
        "url": "http://se1-appsrv-05.prod.tradera.com:8006/BidPlacement",
        "version": "13.32.0.0",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-04-08 10:56:19",
        "hasDeployParameters": false
      },
      {
        "name": "Buying.BuyingDenormalizer",
        "url": null,
        "version": "13.21.0.1",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-03-13 09:13:32",
        "hasDeployParameters": false
      },
      {
        "name": "Buying.Finalization",
        "url": null,
        "version": "13.21.0.1",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-03-13 09:31:03",
        "hasDeployParameters": false
      },
      {
        "name": "FraudDetection.FraudDetectionHandler",
        "url": null,
        "version": "13.25.0.2",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-03-26 10:56:48",
        "hasDeployParameters": false
      },
      {
        "name": "FraudDetection.QueryService",
        "url": "http://se1-appsrv-05.prod.tradera.com:8013/Services",
        "version": "13.25.0.2",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-03-26 10:57:18",
        "hasDeployParameters": false
      }
    ]
  },
  {
    "name": "SE1-APPSRV-04",
    "loadBalancerEnabled": true,
    "loadBalancerId": 14,
    "units": [
      {
        "name": "UserRegistration.ApplicantRegistration",
        "url": "http://se1-appsrv-04.prod.tradera.com:8007/ApplicantRegistration",
        "version": "13.17.0.0",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-03-06 11:23:05",
        "hasDeployParameters": false
      },
      {
        "name": "UserRegistration.ApplicantFinalization",
        "url": null,
        "version": "13.27.0.4",
        "branch": "production",
        "status": "Stopped",
        "info": "Last deployed: 2013-04-03 10:39:50",
        "hasDeployParameters": false
      },
      {
        "name": "UserRegistration.ApplicantFullValidation",
        "url": null,
        "version": "0.0.0.0",
        "branch": null,
        "status": "Stopped",
        "info": "Last deployed: 0001-01-01 00:00:00",
        "hasDeployParameters": false
      },
      {
        "name": "Listing.ChangeItem",
        "url": "http://se1-appsrv-04.prod.tradera.com:8007/ChangeItem",
        "version": "13.06.0.0",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-02-06 10:42:38",
        "hasDeployParameters": false
      },
      {
        "name": "Listing.CreateItem",
        "url": "http://se1-appsrv-04.prod.tradera.com:8007/CreateItem",
        "version": "13.06.0.0",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-02-06 10:42:52",
        "hasDeployParameters": false
      },
      {
        "name": "Listing.CreateItem.Handler",
        "url": null,
        "version": "13.06.0.0",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-02-06 10:01:08",
        "hasDeployParameters": false
      },
      {
        "name": "Listing.CreateShopItem.Handler",
        "url": null,
        "version": "13.06.0.0",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-02-06 10:11:52",
        "hasDeployParameters": false
      },
      {
        "name": "Listing.ItemChange",
        "url": null,
        "version": "13.06.0.0",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-02-06 10:18:17",
        "hasDeployParameters": false
      },
      {
        "name": "Listing.ItemClosing",
        "url": null,
        "version": "13.21.0.1",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-03-13 09:35:37",
        "hasDeployParameters": false
      },
      {
        "name": "Billing.CreateItemFees",
        "url": null,
        "version": "13.24.0.0",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-03-21 10:16:28",
        "hasDeployParameters": false
      },
      {
        "name": "Billing.CreateSubscriptionFees",
        "url": null,
        "version": "13.24.0.0",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-03-21 10:18:15",
        "hasDeployParameters": false
      },
      {
        "name": "MemberManagement.ProfileRefinement",
        "url": null,
        "version": "13.18.0.15",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-03-07 08:16:00",
        "hasDeployParameters": false
      },
      {
        "name": "Payment.ProcessingService",
        "url": "http://se1-appsrv-04.prod.tradera.com:8015/PaymentProcessing",
        "version": "13.33.0.0",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-04-09 10:53:30",
        "hasDeployParameters": false
      },
      {
        "name": "Payment.QueryService",
        "url": "http://se1-appsrv-04.prod.tradera.com:8015/PaymentQueries",
        "version": "13.10.0.0",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-02-12 15:07:23",
        "hasDeployParameters": false
      },
      {
        "name": "OrderManagement.PurchaseOrderStatusHandler",
        "url": null,
        "version": "13.33.0.0",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-04-09 10:54:50",
        "hasDeployParameters": false
      },
      {
        "name": "MemberNotifications.Handler",
        "url": null,
        "version": "13.33.0.0",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-04-09 10:48:57",
        "hasDeployParameters": false
      },
      {
        "name": "Marketing.QueryService",
        "url": "http://se1-appsrv-04.prod.tradera.com:8008/Services",
        "version": "12.39.0.0",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2012-12-03 11:18:12",
        "hasDeployParameters": false
      },
      {
        "name": "Marketing.CommandService",
        "url": "http://se1-appsrv-04.prod.tradera.com:8009/Services",
        "version": "12.39.0.0",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2012-12-03 11:17:48",
        "hasDeployParameters": false
      },
      {
        "name": "Marketing.MarketingHandler",
        "url": null,
        "version": "12.39.0.0",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2012-12-03 11:17:56",
        "hasDeployParameters": false
      },
      {
        "name": "SelfService.CreateErrandHandler",
        "url": null,
        "version": "13.33.0.0",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-04-09 12:51:26",
        "hasDeployParameters": false
      },
      {
        "name": "Buying.BuyingHandler",
        "url": null,
        "version": "0.0.0.0",
        "branch": null,
        "status": "Running",
        "info": "Last deployed: 0001-01-01 00:00:00",
        "hasDeployParameters": false
      },
      {
        "name": "Buying.BuyItem",
        "url": "http://se1-appsrv-04.prod.tradera.com:8006/BuyItem",
        "version": "13.21.0.1",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-03-13 08:39:28",
        "hasDeployParameters": false
      },
      {
        "name": "Buying.BidPlacement",
        "url": "http://se1-appsrv-04.prod.tradera.com:8006/BidPlacement",
        "version": "13.32.0.0",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-04-08 10:56:09",
        "hasDeployParameters": false
      },
      {
        "name": "Buying.BuyingDenormalizer",
        "url": null,
        "version": "13.21.0.1",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-03-13 09:12:14",
        "hasDeployParameters": false
      },
      {
        "name": "Buying.Finalization",
        "url": null,
        "version": "13.21.0.1",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-03-13 09:30:08",
        "hasDeployParameters": false
      },
      {
        "name": "FraudDetection.FraudDetectionHandler",
        "url": null,
        "version": "13.25.0.2",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-03-26 10:48:12",
        "hasDeployParameters": false
      },
      {
        "name": "FraudDetection.QueryService",
        "url": "http://se1-appsrv-04.prod.tradera.com:8013/Services",
        "version": "13.25.0.2",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-03-26 10:48:30",
        "hasDeployParameters": false
      }
    ]
  },
  {
    "name": "SE1-APPSRV-03",
    "loadBalancerEnabled": true,
    "loadBalancerId": 13,
    "units": [
      {
        "name": "UserRegistration.ApplicantRegistration",
        "url": "http://se1-appsrv-03.prod.tradera.com:8007/ApplicantRegistration",
        "version": "13.17.0.0",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-03-06 11:22:23",
        "hasDeployParameters": false
      },
      {
        "name": "UserRegistration.ApplicantFinalization",
        "url": null,
        "version": "13.27.0.4",
        "branch": "production",
        "status": "Stopped",
        "info": "Last deployed: 2013-04-03 10:37:31",
        "hasDeployParameters": false
      },
      {
        "name": "UserRegistration.ApplicantFullValidation",
        "url": null,
        "version": "0.0.0.0",
        "branch": null,
        "status": "Stopped",
        "info": "Last deployed: 0001-01-01 00:00:00",
        "hasDeployParameters": false
      },
      {
        "name": "Listing.ChangeItem",
        "url": "http://se1-appsrv-03.prod.tradera.com:8007/ChangeItem",
        "version": "13.06.0.0",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-02-06 10:43:34",
        "hasDeployParameters": false
      },
      {
        "name": "Listing.CreateItem",
        "url": "http://se1-appsrv-03.prod.tradera.com:8007/CreateItem",
        "version": "13.06.0.0",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-02-06 10:43:49",
        "hasDeployParameters": false
      },
      {
        "name": "Listing.CreateItem.Handler",
        "url": null,
        "version": "13.06.0.0",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-02-06 10:01:05",
        "hasDeployParameters": false
      },
      {
        "name": "Listing.CreateShopItem.Handler",
        "url": null,
        "version": "13.06.0.0",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-02-06 10:11:43",
        "hasDeployParameters": false
      },
      {
        "name": "Listing.ItemChange",
        "url": null,
        "version": "13.06.0.0",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-02-06 10:14:41",
        "hasDeployParameters": false
      },
      {
        "name": "Listing.ItemClosing",
        "url": null,
        "version": "13.21.0.1",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-03-13 09:35:35",
        "hasDeployParameters": false
      },
      {
        "name": "Billing.CreateItemFees",
        "url": null,
        "version": "13.24.0.0",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-03-21 10:16:23",
        "hasDeployParameters": false
      },
      {
        "name": "Billing.CreateSubscriptionFees",
        "url": null,
        "version": "13.24.0.0",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-03-21 10:17:46",
        "hasDeployParameters": false
      },
      {
        "name": "MemberManagement.ProfileRefinement",
        "url": null,
        "version": "13.18.0.15",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-03-07 08:15:17",
        "hasDeployParameters": false
      },
      {
        "name": "Payment.ProcessingService",
        "url": "http://se1-appsrv-03.prod.tradera.com:8015/PaymentProcessing",
        "version": "13.33.0.0",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-04-09 10:53:37",
        "hasDeployParameters": false
      },
      {
        "name": "Payment.QueryService",
        "url": "http://se1-appsrv-03.prod.tradera.com:8015/PaymentQueries",
        "version": "13.10.0.0",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-02-12 15:02:17",
        "hasDeployParameters": false
      },
      {
        "name": "OrderManagement.PurchaseOrderStatusHandler",
        "url": null,
        "version": "13.33.0.0",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-04-09 10:54:56",
        "hasDeployParameters": false
      },
      {
        "name": "MemberNotifications.Handler",
        "url": null,
        "version": "13.33.0.0",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-04-09 10:50:48",
        "hasDeployParameters": false
      },
      {
        "name": "Marketing.QueryService",
        "url": "http://se1-appsrv-03.prod.tradera.com:8008/Services",
        "version": "12.39.0.0",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2012-12-03 11:18:09",
        "hasDeployParameters": false
      },
      {
        "name": "Marketing.CommandService",
        "url": "http://se1-appsrv-03.prod.tradera.com:8009/Services",
        "version": "12.39.0.0",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2012-12-03 11:17:46",
        "hasDeployParameters": false
      },
      {
        "name": "Marketing.MarketingHandler",
        "url": null,
        "version": "12.39.0.0",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2012-12-03 11:17:54",
        "hasDeployParameters": false
      },
      {
        "name": "SelfService.CreateErrandHandler",
        "url": null,
        "version": "13.33.0.0",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-04-09 12:51:33",
        "hasDeployParameters": false
      },
      {
        "name": "Buying.BuyingHandler",
        "url": null,
        "version": "0.0.0.0",
        "branch": null,
        "status": "Running",
        "info": "Last deployed: 0001-01-01 00:00:00",
        "hasDeployParameters": false
      },
      {
        "name": "Buying.BuyItem",
        "url": "http://se1-appsrv-03.prod.tradera.com:8006/BuyItem",
        "version": "13.21.0.1",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-03-13 08:39:22",
        "hasDeployParameters": false
      },
      {
        "name": "Buying.BidPlacement",
        "url": "http://se1-appsrv-03.prod.tradera.com:8006/BidPlacement",
        "version": "13.32.0.0",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-04-08 10:54:46",
        "hasDeployParameters": false
      },
      {
        "name": "Buying.BuyingDenormalizer",
        "url": null,
        "version": "13.21.0.1",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-03-13 09:11:38",
        "hasDeployParameters": false
      },
      {
        "name": "Buying.Finalization",
        "url": null,
        "version": "13.21.0.1",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-03-13 09:29:07",
        "hasDeployParameters": false
      },
      {
        "name": "FraudDetection.FraudDetectionHandler",
        "url": null,
        "version": "13.25.0.2",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-03-26 10:30:58",
        "hasDeployParameters": false
      },
      {
        "name": "FraudDetection.QueryService",
        "url": "http://se1-appsrv-03.prod.tradera.com:8013/Services",
        "version": "13.25.0.2",
        "branch": "production",
        "status": "Running",
        "info": "Last deployed: 2013-03-26 10:31:23",
        "hasDeployParameters": false
      }
    ]
  }
];

module.exports = function(server) {

	server.get("/units/list", function(req, res) {

		var agentsResp = [];

		_.forEach(data, function(item) {
			_.forEach(item.units, function(unit) {
				unit.actions = ["Verify", "Stop", "Start"];
			});
		});

		/*async.forEach(config.agents, function(agent, done) {
			if (agent.dead) {
				done();
				return;
			}

			var client = restify.createJsonClient({ url: agent.url, connectTimeout: 200 });

			client.get('/units/list', function(err, req, _, units) {
				if (err) {
					agent.dead = true;
					done();
					return;
				}

				agentsResp.push({
						name: agent.name,
						loadBalancerEnabled: agent.loadBalancerEnabled,
						loadBalancerId: agent.loadBalancerId,
						units: units
				});

				done();
			});

		}, function() {
			res.json(agentsResp);
		});*/

		res.json(data);

	});

	server.get("/units/:unitName/deployParameters", function(req, res) {


	});

};