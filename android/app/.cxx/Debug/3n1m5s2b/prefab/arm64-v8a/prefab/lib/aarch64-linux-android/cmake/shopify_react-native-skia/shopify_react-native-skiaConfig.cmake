if(NOT TARGET shopify_react-native-skia::rnskia)
add_library(shopify_react-native-skia::rnskia SHARED IMPORTED)
set_target_properties(shopify_react-native-skia::rnskia PROPERTIES
    IMPORTED_LOCATION "/home/kali/Desktop/WeatherApp/node_modules/@shopify/react-native-skia/android/build/intermediates/cxx/Debug/6l0526b6/obj/arm64-v8a/librnskia.so"
    INTERFACE_INCLUDE_DIRECTORIES "/home/kali/Desktop/WeatherApp/node_modules/@shopify/react-native-skia/android/build/headers/rnskia"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

