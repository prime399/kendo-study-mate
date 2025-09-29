import { setScriptKey } from "@progress/kendo-licensing"
import fs from "node:fs"
import path from "node:path"

let licenseLoaded = false

export function ensureKendoLicense() {
  if (licenseLoaded) return
  if (typeof window !== "undefined") {
    licenseLoaded = true
    return
  }

  try {
    const licensePath = path.resolve(process.cwd(), "telerik-license.txt")
    const license = fs.readFileSync(licensePath, "utf8").trim()

    if (license) {
      setScriptKey(license)
      licenseLoaded = true
    }
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("Kendo license failed to load", error)
    }
  }
}
