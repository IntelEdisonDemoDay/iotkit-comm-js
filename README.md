**{@tutorial start-here}** to begin developing applications and plugins that use the iecf (Intel Edison
Connectivity Framework) library. Otherwise, continue reading to learn more.

iecf (Intel Edison Connectivity Framework) allows network-connected devices to conveniently discover and communicate
with each other and the cloud. More specifically, the iecf library enables developers to write distributed
applications composed of clients, servers, and peers (both client and server in one). It was designed primarily for
the Intel Edison platform, but works just as well on other platforms. The iecf is a library that comes in two
flavors: C and node.js. This documentation focuses on the node.js version of the library.

#### How to read this documentation

There are two entry points:
* For browsing the API reference, the entry point is the 'Modules' section (we suggest starting with the {@link
module:main|'main'} module).
* For tutorials on how to use the API, the entry point is the 'Tutorials' section (we suggest starting with the
'{@tutorial start-here}' tutorial).

*Note: for the purposes of this documentation, a module is a logical grouping of classes, methods,
and variables. Please be aware that this is the **logical structure of the documentation only**
and not the iecf codebase.*

#### Prerequisites

The iecf library is supported only on the Edison platform *(support for other platforms coming soon)*.
