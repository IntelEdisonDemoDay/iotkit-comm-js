/*
 * MDNS Plugin to handle addition and removal of MDNS Service Records
 * Copyright (c) 2014, Intel Corporation.
 *
 * This program is free software; you can redistribute it and/or modify it
 * under the terms and conditions of the GNU Lesser General Public License,
 * version 2.1, as published by the Free Software Foundation.
 *
 * This program is distributed in the hope it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.  See the GNU Lesser General Public License for
 * more details.
 */

#ifndef __EDISON_MDNS_H__
#define __EDISON_MDNS_H__

#include "edisonapi.h"

#define LOCAL_ADDRESS "127.0.0.1"


/** Discover context to be passed around which contains function pointers to
 * callback and user filter callback methods
 */
typedef struct _DiscoverContext {
    bool (*userFilterCB)(ServiceQuery *);
    void (*callback)(void *, int32_t, void *);
    void *serviceSpec;
} DiscoverContext;


/** Service cache to hold list of services discovered via DNS
 */
typedef struct _ServiceCache{
    char *servicename;
    char *address;
    struct ServiceCache *next;
} ServiceCache;


ServiceCache *serviceCache = NULL;
int myaddressesCount = 0;
char **myaddresses = NULL;


bool serviceQueryFilter(ServiceQuery *srvQry, char *fullname, uint16_t PortAsNumber, uint16_t txtLen, const unsigned char *txtRecord);
char* serviceAddressFilter(ServiceQuery *srvQry, const char *hosttarget, const char *fullname, uint16_t portAsNumber);
bool isServiceLocal(const char *address);

#endif