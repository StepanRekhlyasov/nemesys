import { useOrganization } from 'src/stores/organization';
import { WatchCallback, WatchOptions, watch } from 'vue';

export function watchCurrentOrganization(cb: WatchCallback<string, string | undefined>, options?: WatchOptions<boolean>) {
    const organization = useOrganization()
    return watch(() => organization.currentOrganizationId, (v, o, on) => cb(v, o, on), options)
}