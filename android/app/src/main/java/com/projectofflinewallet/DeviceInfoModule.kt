package com.projectofflinewallet

import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.net.ConnectivityManager
import android.os.BatteryManager
import com.facebook.react.bridge.*

class DeviceInfoModule(
  private val reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String {
    return "DeviceInfoNative"
  }

  @ReactMethod
  fun getBatteryLevel(promise: Promise) {
    try {
      val intent = reactContext.registerReceiver(
        null,
        IntentFilter(Intent.ACTION_BATTERY_CHANGED)
      )

      val level = intent?.getIntExtra(BatteryManager.EXTRA_LEVEL, -1) ?: -1
      val scale = intent?.getIntExtra(BatteryManager.EXTRA_SCALE, -1) ?: -1

      if (level >= 0 && scale > 0) {
        val batteryPct = (level * 100) / scale
        promise.resolve(batteryPct)
      } else {
        promise.reject("ERR_BATTERY", "Unable to fetch battery level")
      }
    } catch (e: Exception) {
      promise.reject("ERR_BATTERY", e)
    }
  }

  @ReactMethod
  fun getNetworkType(promise: Promise) {
    try {
      val cm =
        reactContext.getSystemService(Context.CONNECTIVITY_SERVICE)
          as ConnectivityManager

      val network = cm.activeNetworkInfo

      if (network != null && network.isConnected) {
        val type = when (network.type) {
          ConnectivityManager.TYPE_WIFI -> "WIFI"
          ConnectivityManager.TYPE_MOBILE -> "MOBILE"
          else -> "OTHER"
        }
        promise.resolve(type)
      } else {
        promise.resolve("NONE")
      }
    } catch (e: Exception) {
      promise.reject("ERR_NETWORK", e)
    }
  }
}
